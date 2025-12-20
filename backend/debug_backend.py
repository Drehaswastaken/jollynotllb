import os
import sys
import traceback
from dotenv import load_dotenv

print("--- DEBUG START ---")
print(f"CWD: {os.getcwd()}")

# 1. Test .env loading
try:
    load_dotenv()
    token = os.getenv("HF_TOKEN")
    print(f"Token variable present: {'Yes' if token else 'No'}")
    if token:
        print(f"Token length: {len(token)}")
        print(f"Token starts with: {token[:4]}")
        if token.strip() != token:
            print("WARNING: Token has leading/trailing whitespace!")
    else:
        print("ERROR: HF_TOKEN is missing or empty.")
except Exception as e:
    print(f"Error loading .env: {e}")

# 2. Test Imports
try:
    print("Attempting to import libraries...")
    import fastapi
    print("fastapi imported")
    import huggingface_hub
    print("huggingface_hub imported")
    from agents import MootCourtAgents
    print("MootCourtAgents imported")
except ImportError as e:
    print(f"IMPORT ERROR: {e}")
    print("Suggest installing dependencies: pip install -r requirements.txt huggingface_hub")
    sys.exit(1)
except Exception as e:
    print(f"Unexpected import error: {e}")
    traceback.print_exc()
    sys.exit(1)

# 3. Test Class Initialization
try:
    print("Attempting to init MootCourtAgents...")
    agent = MootCourtAgents()
    print("SUCCESS: MootCourtAgents initialized.")
except Exception as e:
    print(f"INIT ERROR: {e}")
    traceback.print_exc()

print("--- DEBUG END ---")
