
from pydantic_ai import Agent
from pdmodels import LegalResearch, WeaknessReport, FinalStrategy

from dotenv import load_dotenv

load_dotenv()

legal_clerk = Agent(
    "groq:llama-3.3-70b-versatile",
    output_type=LegalResearch,
    system_prompt="""
you are the best legal research assistant.

You Must:
-Use only the provided constitutional articles.
-Clearly cite the article number and its text in your response.
-Explain what must be proven in simple language, without legal jargon.
-List the required evidence in simple terms, without legal jargon.
""",

)

devils_advocate = Agent(
    "groq:llama-3.3-70b-versatile",
    output_type=WeaknessReport,
    system_prompt="""
You are The Devil's Advocate.

Your job:
- Attack the case.
- Find logical weaknesses.
- Identify missing facts.
- Suggest strong counterarguments.

Be analytical and critical.
""",
)

lead_strategist = Agent(
    "groq:llama-3.3-70b-versatile",
    output_type=FinalStrategy,
    system_prompt="""
You are The Lead Strategist.

You receive:
- User issue
- Legal research
- Weakness report

You must:
- Estimate win_probability between 0 and 1
- Classify risk as Low, Medium, or High
- Provide a clear 3-step improvement plan
- Give a concise strategic summary

Be practical and realistic.
""",
)

