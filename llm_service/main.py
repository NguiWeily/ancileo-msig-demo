from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
import json

app = FastAPI()
DATA_DIR = Path(__file__).resolve().parent.parent / 'sample_policies'

class QARequest(BaseModel):
    question: str
    policyId: str

@app.post("/qa")
async def qa(req: QARequest):
    # This is a deterministic demo: it reads the sample_policy.txt and returns a canned
    # answer with a "citation" (page simulated).
    policy_path = DATA_DIR / req.policyId
    if not policy_path.exists():
        return {"error": "policy not found", "policyId": req.policyId}
    text = policy_path.read_text()
    q = req.question.lower()
    # Simple rule-based demo:
    if 'cancel' in q or 'cancellation' in q:
        answer = ("You are likely covered for trip cancellation if you test positive within 7 days of departure. "
                  "Citation: Sample TravelEasy Policy, Page 2, Section 4. Trip Cancellation.")
    elif 'medical' in q or 'medical expense' in q:
        answer = ("Emergency medical expenses are covered up to $100,000 per insured person. "
                  "Citation: Sample TravelEasy Policy, Page 3, Section 7. Emergency Medical.")
    else:
        answer = ("I couldn't find a direct match in the policy. Try asking about 'cancellation' or 'medical'. "
                  "Citation: Sample TravelEasy Policy (see pages 2-3).")
    return {"answer": answer, "question": req.question, "policyId": req.policyId}

@app.get("/health")
async def health():
    return {"ok": True}
