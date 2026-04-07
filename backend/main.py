import os
import logging
from typing import List,Dict, Any, Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from rag import ConstitutionRAG
from pdagents import legal_clerk, devils_advocate, lead_strategist

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Astra 2.0 - Legal Strategy AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

rag_system = None

@app.on_event("startup")
def startup_event():
    global rag_system
    try:
        BASE_DIR = os.path.dirname(__file__)
        PROJECT_ROOT = os.path.dirname(BASE_DIR)

        JSON_PATH = os.path.join(PROJECT_ROOT, "constitution_of_india.json")

        rag_system = ConstitutionRAG(JSON_PATH)

        logger.info("RAG system initialized successfully")

    except Exception as e:
        logger.error(f"Failed to initialize RAG system: {e}")   

class SimulationRequest(BaseModel):
    question: str

class AgentResponse(BaseModel):
    agent_name: str
    role: str
    content: Dict[str, Any]

@app.get("/")
def read_root():
    return {
        "Status": "Astra is running!",
        "version": "2.0",
    }

@app.post("/analyze", response_model=List[AgentResponse])
async def analyze_case(request: SimulationRequest):
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        retrieved_info = rag_system.retrieve(request.question, k=3)

        context  = "\n\n".join([r["text"] for r in retrieved_info])
        logger.info(f"Retrieved context for question: {request.question}")

        clerk_input = f"""
user issue:
{request.question}

relevant constitutional articles:
{context}
"""
        research = await legal_clerk.run(clerk_input)

        critique = await devils_advocate.run(request.question)

        strategy_input = f"""
user issue:
{request.question}

Legal research:
{research.output}

Weakness report:
{critique.output}
"""
        strategy = await lead_strategist.run(strategy_input)

        return [
            {
                "agent_name": "Legal Clerk",
                "role": "Research",
                "content": research.output.model_dump()
            },
            {
                "agent_name": "Devil's Advocate",
                "role": "Critique",
                "content": critique.output.model_dump()
            },
            {
                "agent_name": "Lead Strategist",
                "role": "Strategy",
                "content": strategy.output.model_dump()
            }
        ]

    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
    