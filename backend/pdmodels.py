from pydantic import BaseModel
from typing import List

class LegalResearch(BaseModel):
    legal_elements: str
    elements_to_prove: List[str]
    relevant_laws: List[str]
    required_evidence: List[str]

class WeaknessReport(BaseModel):
    logical_gaps: List[str]
    missing_evidence: List[str]
    possible_defenses: List[str]

class FinalStrategy(BaseModel):
    win_probability: float
    risk_level: str
    three_step_action_plan: List[str]
    overall_assessment: str


    