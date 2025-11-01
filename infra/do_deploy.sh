#!/usr/bin/env bash
# Example doctl-based deployment commands (customize BEFORE running).
# Requires `doctl` installed and authenticated: `doctl auth init`

set -e
# Create project (optional)
# doctl projects create --name ancileo-demo --description "Ancileo MSIG demo"

echo "Create App with app.yaml manually in the DigitalOcean App Platform UI or use 'doctl apps create --spec app.yaml' (advanced)."
echo "You will need to set LLM_SERVICE_URL env var to your llm service URL (if deployed separately)."
