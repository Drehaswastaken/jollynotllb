import os
import json
from dataclasses import dataclass
from typing import List, Optional

# 1. CHANGE: Import Hugging Face Client instead of OpenAI
from huggingface_hub import InferenceClient

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

@dataclass
class AgentMessage:
    agent_name: str
    role: str
    content: str
    metadata: Optional[dict] = None

class MootCourtAgents:
    def __init__(self):
        # 2. CHANGE: Initialize Hugging Face Client
        # We use the HF_TOKEN from environment variables
        api_key = os.getenv("HF_TOKEN")
        if not api_key:
            raise ValueError("HF_TOKEN is missing from .env file")
        
        self.client = InferenceClient(api_key=api_key)
        
        # 3. CHANGE: Select a high-performance free model
        # Qwen 2.5 7B is excellent for logic and following JSON instructions
        self.model = "Qwen/Qwen2.5-7B-Instruct" 

    def _call_llm(self, system_prompt: str, user_prompt: str, max_tokens=500) -> str:
        """Helper to send data to AI via Hugging Face"""
        try:
            # 4. CHANGE: Update the API call method
            # The structure is very similar to OpenAI, but we use the HF client
            response = self.client.chat_completion(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=max_tokens,
                stream=False
            )
            # HF Python client mimics OpenAI's response structure
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error connecting to Hugging Face: {str(e)}"

    def clerk_research(self, user_case: str) -> str:
        """Finds the legal checklist for this specific type of case."""
        sys_prompt = (
            "You are a Senior Legal Researcher. Your goal is NOT to cite random cases, "
            "but to identify the specific 'Legal Elements' required to win this type of case. "
            "List the 3-4 things the user MUST prove. I need it in simple language."
        )
        return self._call_llm(sys_prompt, f"The user wants to do this: '{user_case}'. What are the legal requirements?")

    def defense_stress_test(self, user_case: str, legal_elements: str) -> str:
        """The Defense tries to break the case immediately."""
        sys_prompt = (
            "You are a 'Devil's Advocate' Defense Attorney. Look at the user's case and the legal requirements. "
            "Do not be nice. Identify the single biggest weakness, loophole, or missing evidence "
            "that could destroy their case. I need it in simple language."
        )
        user_prompt = f"User Case: {user_case}\nLegal Requirements: {legal_elements}\n\nFind the weak point:"
        return self._call_llm(sys_prompt, user_prompt)

    def strategist_analysis(self, user_case: str, legal_elements: str, defense_point: str) -> dict:
        """Synthesizes everything into a final user guide."""
        
        # Note: Open models sometimes need stronger prompting for JSON.
        # I added "Ensure valid JSON" to the prompt below.
        sys_prompt = (
            "You are a Lead Legal Strategist. Your job is to give the client a final reality check. "
            "Review the case requirements and the defense's attack. "
            "Return a JSON object with: "
            "1. 'probability': A percentage (0-100) of success. "
            "2. 'assessment': A blunt summary of their position. "
            "3. 'action_plan': A numbered list of 3 specific steps they must take to fix the weaknesses. "
            "RETURN JSON ONLY. Do not wrap in markdown blocks. I need it in simple language."
        )
        
        user_prompt = (
            f"Case: {user_case}\n"
            f"Law: {legal_elements}\n"
            f"Risks identified: {defense_point}\n\n"
            "Provide the strategic report."
        )

        raw_response = self._call_llm(sys_prompt, user_prompt, max_tokens=600)
        
        # Clean JSON formatting (removes markdown code blocks if the model adds them)
        cleaned_json = raw_response.replace("```json", "").replace("```", "").strip()
        
        try:
            return json.loads(cleaned_json)
        except json.JSONDecodeError:
            # Fallback if the open model fails strict JSON formatting
            return {
                "probability": 0, 
                "assessment": f"Error parsing JSON from model. Raw output: {raw_response[:100]}...", 
                "action_plan": ["Consult a real lawyer", "Retry the analysis"]
            }

    def run_simulation(self, user_question: str) -> List[AgentMessage]:
        transcript = []

        # 1. The Clerk defines the Rules of the Game
        legal_rules = self.clerk_research(user_question)
        transcript.append(AgentMessage(
            agent_name="Legal Clerk", 
            role="Research", 
            content=f"To win this case, the law requires you to prove:\n{legal_rules}"
        ))

        # 2. The Defense tries to break the case (Stress Test)
        risk_analysis = self.defense_stress_test(user_question, legal_rules)
        transcript.append(AgentMessage(
            agent_name="Devil's Advocate", 
            role="Risk Analysis", 
            content=f"Here is where your case might fail:\n{risk_analysis}"
        ))

        # 3. The Strategist gives the Final Roadmap
        final_report = self.strategist_analysis(user_question, legal_rules, risk_analysis)
        
        # Format the final report nicely for the frontend
        report_text = (
            f"--- CASE VIABILITY: {final_report.get('probability')}% ---\n\n"
            f"ASSESSMENT:\n{final_report.get('assessment')}\n\n"
            f"RECOMMENDED NEXT STEPS:\n" + 
            "\n".join([f"- {step}" for step in final_report.get('action_plan', [])])
        )

        transcript.append(AgentMessage(
            agent_name="Lead Strategist", 
            role="Final Verdict", 
            content=report_text
        ))

        return transcript

# Example usage (for testing)
if __name__ == "__main__":
    agents = MootCourtAgents()
    # Test case: User wants to sue a coffee shop for hot coffee
    result = agents.run_simulation("I want to sue a cafe because their coffee was too hot and I burned my tongue.")
    
    for msg in result:
        print(f"\n[{msg.agent_name}]: {msg.content}")