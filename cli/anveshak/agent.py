"""
AnveshakSutra CLI Autonomous Self-Healing Agent & Workspace Watcher
Continuously monitors local files, detects secrets, auto-probes, and heals code in real-time.
"""

import time
import os
from pathlib import Path
from typing import List, Dict, Any
from anveshak.scanner import scan_directory, SECRET_PATTERNS
from anveshak.canary import generate_canary
from anveshak.probes import execute_verification_probe

def run_self_healing_routine(target_dir: str = ".") -> Dict[str, Any]:
    """
    Scans directory, identifies exposed secrets, and automatically replaces them with Canary Honey-Tokens!
    """
    root = Path(target_dir).resolve()
    findings = scan_directory(target_dir)
    healed_files = []

    if not findings:
        return {"status": "CLEAN", "healed_count": 0, "message": "No secret exposures detected. Workspace is safe."}

    for f in findings:
        file_path = root / f["file"]
        raw_val = f.get("raw_match")

        if not raw_val:
            continue

        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as file_read:
                content = file_read.read()

            # Determine canary type
            sec_type = f["type"].lower()
            canary_type = "aws" if "aws" in sec_type else ("openai" if "openai" in sec_type else "github")
            canary = generate_canary(canary_type, f"Auto-Healed Decoy for {f['file']}")
            canary_val = canary.get("token_value") or canary.get("token_id", "CANARY_TRIPWIRE_REPLACEMENT")

            # Replace exposed secret with canary in place
            healed_content = content.replace(raw_val, canary_val)
            with open(file_path, "w", encoding="utf-8") as file_write:
                file_write.write(healed_content)

            healed_files.append({
                "file": f["file"],
                "type": f["type"],
                "replaced_with_canary": canary_val,
            })
        except Exception as e:
            continue

    return {
        "status": "HEALED",
        "healed_count": len(healed_files),
        "healed_items": healed_files,
        "message": f"Successfully auto-healed {len(healed_files)} exposed secret(s) by planting Canary tripwires.",
    }

def watch_workspace_continuous(target_dir: str = ".", interval_seconds: int = 3):
    """
    Live file watcher daemon that monitors local workspace for secret leaks in real-time.
    """
    print(f"\n[*] AnveshakSutra Live Sentinel Daemon: Watching '{target_dir}' every {interval_seconds}s...")
    print("[*] Press Ctrl+C to stop.\n")

    try:
        while True:
            findings = scan_directory(target_dir)
            if findings:
                print(f"[{time.strftime('%H:%M:%S')}] 🚨 ALERT: Detected {len(findings)} exposed secret(s) in active workspace!")
                for f in findings:
                    print(f"   * {f['file']}:{f['line']} -> {f['type']} ({f['snippet']})")
                print("   [>] Run 'anveshak heal' to automatically scrub and plant Canary tripwires.\n")
            time.sleep(interval_seconds)
    except KeyboardInterrupt:
        print("\n[+] Sentinel daemon stopped.")
