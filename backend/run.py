import uvicorn
import os
import sys

# Ensure current directory is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0" if os.getenv("PORT") else "127.0.0.1")
    reload = os.getenv("RELOAD", "true" if not os.getenv("PORT") else "false").lower() == "true"
    print(f"Starting National Land Governance Platform Backend on http://{host}:{port}...")
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
