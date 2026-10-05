import subprocess
import time
import sys
import os

root_dir = os.path.abspath(os.path.dirname(__file__))
backend_dir = os.path.join(root_dir, "backend")
frontend_dir = os.path.join(root_dir, "frontend")

print("=" * 70)
print(" National Digital Platform for Land Governance (NDP-LG)")
print(" Ministry of Rural Development (DoLR) | SIH 2026")
print("=" * 70)

# 1. Run seed data
print("\n[1/3] Ensuring database is seeded with official SIH MoRD datasets...")
subprocess.run([sys.executable, "-m", "app.seed_data"], cwd=backend_dir)

# 2. Launch Backend
print("\n[2/3] Launching FastAPI Backend on http://127.0.0.1:8000...")
backend_proc = subprocess.Popen([sys.executable, "run.py"], cwd=backend_dir)

time.sleep(2)

# 3. Launch Frontend
print("\n[3/3] Launching React Vite Frontend on http://127.0.0.1:5173...")
# On Windows, npm is npm.cmd
npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
frontend_proc = subprocess.Popen([npm_cmd, "run", "dev", "--", "--host", "0.0.0.0"], cwd=frontend_dir)

# 4. Optional Cloudflare Tunnel
tunnel_proc = None
cloudflared_exe = r"C:\Users\Kr809\.gemini\antigravity\scratch\cloudflared.exe"
if ("--share" in sys.argv or "--tunnel" in sys.argv) and os.path.exists(cloudflared_exe):
    print("\n[4/4] Starting Cloudflare Public Tunnel for instant sharing...")
    tunnel_proc = subprocess.Popen([cloudflared_exe, "tunnel", "--url", "http://127.0.0.1:5173"])

print("\n" + "=" * 70)
print(" Platform Services Online!")
print(" Frontend Web Application: http://127.0.0.1:5173")
print(" Backend REST API Gateway: http://127.0.0.1:8000")
print(" Interactive Swagger Docs:  http://127.0.0.1:8000/docs")
if tunnel_proc:
    print(" Shareable Public Tunnel:   See terminal log above for trycloudflare.com URL")
print("=" * 70)
print("Press Ctrl+C to terminate all services.")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nStopping services...")
    backend_proc.terminate()
    frontend_proc.terminate()
    if tunnel_proc:
        tunnel_proc.terminate()
    print("Shutdown complete.")
