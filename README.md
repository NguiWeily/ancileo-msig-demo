# Ancileo-MSIG Demo — Deployable to DigitalOcean (AMD-ready)

**What this is**
A minimal demo repository for the Ancileo × MSIG hackathon:
- Simple frontend (static HTML + JS) that uploads a sample policy and asks questions.
- Backend API (Node + Express) that proxies requests to an LLM microservice.
- LLM microservice (FastAPI) with a simple retrieval stub that returns answers with exact-page-style citations.
- Dockerfiles for each service and a GitHub Actions CI workflow.
- App Platform manifest (`app.yaml`) to deploy to DigitalOcean App Platform, plus a stub `do_deploy.sh`.

This repo is intentionally lightweight so you can deploy quickly to DigitalOcean App Platform or to Droplets (including AMD GPU Droplets for model hosting).

**Contents**
- `frontend/` — static demo UI.
- `server/` — Node/Express API.
- `llm_service/` — FastAPI microservice (placeholder for PDF extraction + retrieval).
- `infra/do_deploy.sh` — example `doctl` commands (requires `doctl` CLI and your DigitalOcean token).
- `.github/workflows/ci.yml` — example CI to build images.

**Quick local run (recommended for testing)**
1. Start the LLM service (requires Python 3.11+):
   ```bash
   cd llm_service
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
2. Start the backend:
   ```bash
   cd server
   npm ci
   node index.js
   ```
3. Open `frontend/index.html` in your browser (or serve it with a static server). The frontend expects the backend at `http://localhost:8080`.

**Deploy to DigitalOcean App Platform**
- Use `app.yaml` with the App Platform UI or `doctl` to create an app. See `infra/do_deploy.sh` for example commands.
- For production LLM inference consider provisioning an **AMD GPU Droplet** and running `llm_service` there; set `LLM_SERVICE_URL` to its URL.

**Notes & Next steps**
- The LLM service here is a stub returning deterministic responses so the demo is reliable offline. Replace `llm_service/utils/vectorstore.py` with a real vector DB + model pipeline (e.g., FAISS + HuggingFace/Local Llama 2 / OpenAI).
- Add DigitalOcean Spaces integration to store uploaded PDFs and use `pdfminer`/`PyMuPDF` in `llm_service` for accurate PDF extraction and page-anchored citations.

Run the demo and I can extend it to use a real retrieval+LLM pipeline or produce a production-ready repo with full CI/CD to App Platform + AMD Droplet guidance.
