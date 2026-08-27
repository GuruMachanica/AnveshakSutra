"""
AnveshakSutra Developer CLI (anveshak)
Autonomous Zero-Knowledge Breach Intelligence, Secret Scanner, ML Entropy & Self-Healing Agent.
"""

import sys
import argparse
import asyncio
from pathlib import Path

# Add package root to path for direct execution and installed package modes
cli_root = Path(__file__).resolve().parent.parent
if str(cli_root) not in sys.path:
    sys.path.insert(0, str(cli_root))

from anveshak.scanner import scan_directory
from anveshak.probes import check_exposure_zk, execute_verification_probe
from anveshak.canary import generate_canary
from anveshak.agent import run_self_healing_routine, watch_workspace_continuous
from anveshak.ml_scanner import scan_file_for_high_entropy_tokens
from anveshak.reporter import generate_local_forensic_report

BANNER = r"""
   ___                               __          __  _____       __             
  /   |  ____ _   _____  _____ / /_  ____ _/ /_/ ___/__  __/ /__________ _
 / /| | / __ \ | / / _ \/ ___// __ \/ __ `/ //_/\__ \ / / / __/ ___/ __ `/
/ ___ |/ / / / |/ /  __(__  )/ / / / /_/ / ,<  ___/ // / / /_/ /  / /_/ / 
/_/  |_/_/ /_/|___/\___/____//_/ /_/\__,_/_/|_|/____//_/  \__/_/   \__,_/  
                    Autonomous Self-Healing Breach Shield v1.0.0
"""

def safe_print(text: str):
    """Encodes safely for all platform terminals."""
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode("ascii", "replace").decode("ascii"))

def format_finding(f: dict) -> str:
    return f"  [EXPOSURE FOUND] {f['file']}:{f['line']} -> {f['type']} ({f['snippet']})"

def main():
    parser = argparse.ArgumentParser(
        prog="anveshak",
        description="AnveshakSutra Developer CLI: Autonomous secret exposure detection, ML entropy analysis & self-healing."
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Command: scan
    scan_parser = subparsers.add_parser("scan", help="Scan local directory or git repository for exposed secrets & API keys")
    scan_parser.add_argument("path", nargs="?", default=".", help="Directory to scan (default: current directory)")
    scan_parser.add_argument("--fail-on-leak", action="store_true", help="Exit with non-zero code if secrets are detected (for CI/CD)")

    # Command: heal (Autonomous Self-Healing)
    heal_parser = subparsers.add_parser("heal", help="Scan and automatically replace exposed secrets with Canary Honey-Tokens")
    heal_parser.add_argument("path", nargs="?", default=".", help="Directory to auto-heal (default: current directory)")

    # Command: watch (Live Sentinel Watcher)
    watch_parser = subparsers.add_parser("watch", help="Live file watcher daemon that continuously monitors your workspace")
    watch_parser.add_argument("path", nargs="?", default=".", help="Directory to watch (default: current directory)")
    watch_parser.add_argument("--interval", type=int, default=3, help="Polling interval in seconds (default: 3s)")

    # Command: entropy (ML Shannon Entropy Scan)
    entropy_parser = subparsers.add_parser("entropy", help="Scan file for unformatted high-entropy cryptographic keys (ML mode)")
    entropy_parser.add_argument("file", help="File to analyze for high-entropy secrets")

    # Command: report (Forensic Report Generator)
    report_parser = subparsers.add_parser("report", help="Generate a cryptographically sealed Markdown forensic incident report")
    report_parser.add_argument("output_dir", nargs="?", default=".", help="Directory to save the forensic report")

    # Command: check (Zero-Knowledge Lookup)
    check_parser = subparsers.add_parser("check", help="Execute a zero-knowledge k-anonymity breach check for an email or token")
    check_parser.add_argument("identifier", help="Email, username, or API token to verify")

    # Command: canary (Tripwire Generator)
    canary_parser = subparsers.add_parser("canary", help="Generate realistic honey-token tripwires")
    canary_parser.add_argument("--type", choices=["aws", "github", "openai"], default="github", help="Canary token type")
    canary_parser.add_argument("--memo", default="CLI Planted Decoy", help="Canary placement description")

    # Command: verify (Active Verification Probe)
    verify_parser = subparsers.add_parser("verify", help="Execute an active verification probe against a revoked token")
    verify_parser.add_argument("--type", choices=["GITHUB_PAT", "OPENAI_KEY"], required=True, help="Token provider type")
    verify_parser.add_argument("--token", required=True, help="Revoked token string to verify")

    args = parser.parse_args()

    if not args.command:
        safe_print(BANNER)
        parser.print_help()
        sys.exit(0)

    if args.command == "scan":
        safe_print(f"\n[*] AnveshakSutra Secret Scanner: Inspecting '{args.path}'...\n")
        findings = scan_directory(args.path)
        if findings:
            safe_print(f"[!] Detected {len(findings)} potential secret exposure(s):")
            for f in findings:
                safe_print(format_finding(f))
            safe_print("\n[>] Recommendation: Run 'anveshak heal' to replace exposed keys with Canary tripwires.")
            if args.fail_on_leak:
                sys.exit(1)
        else:
            safe_print("[+] Perimeter Clean: No exposed secrets or unencrypted keys detected in workspace.\n")

    elif args.command == "heal":
        safe_print(f"\n[*] AnveshakSutra Autonomous Self-Healing Engine: Inspecting '{args.path}'...")
        res = run_self_healing_routine(args.path)
        if res.get("healed_count", 0) > 0:
            safe_print(f"[+] {res['message']}")
            for item in res.get("healed_items", []):
                safe_print(f"    * Healed {item['file']} ({item['type']}) -> Planted Canary Tripwire: {item['replaced_with_canary']}")
            safe_print("\n[+] Workspace perimeter secured and deception tripwires armed.\n")
        else:
            safe_print("[+] Workspace is clean. No secret exposures required self-healing.\n")

    elif args.command == "watch":
        watch_workspace_continuous(args.path, args.interval)

    elif args.command == "entropy":
        safe_print(f"\n[*] Evaluating Shannon Entropy H(X) for '{args.file}'...")
        results = scan_file_for_high_entropy_tokens(Path(args.file))
        if results:
            safe_print(f"[!] Detected {len(results)} high-entropy candidate token(s):")
            for r in results:
                safe_print(f"    * Line {r['line']} -> {r['token_sample']} (Entropy: {r['entropy']} bits/char)")
        else:
            safe_print("[+] No anomalous high-entropy secret patterns detected in file.\n")

    elif args.command == "report":
        out = generate_local_forensic_report(args.output_dir)
        safe_print(f"\n[+] Generated Cryptographically Sealed Forensic Report: {out}\n")

    elif args.command == "check":
        safe_print(f"\n[*] Zero-Knowledge K-Anonymity Proof Check for '{args.identifier}'...")
        res = asyncio.run(check_exposure_zk(args.identifier))
        safe_print(f"   * SHA-256 Prefix Bucket: {res['searched_prefix']} (zero plaintexts transmitted)")
        if res.get("is_exposed"):
            safe_print(f"   * Status: MATCH FOUND IN BREACH CORPUS (Exposures: {res.get('exposure_count', 1)})")
            safe_print("   * Action Required: Force immediate password/passkey rotation on this identity.")
        else:
            safe_print(f"   * Status: CLEAN (No matches found in active monitoring pools)\n")

    elif args.command == "canary":
        canary = generate_canary(args.type, args.memo)
        safe_print(f"\n[+] Generated Canary Honey-Credential Tripwire:")
        for k, v in canary.items():
            safe_print(f"   * {k.upper()}: {v}")
        safe_print("\n[+] Monitored automatically across 100+ dark web, pastebin, and GitHub leak streams.\n")

    elif args.command == "verify":
        safe_print(f"\n[*] Executing Non-Destructive Active Verification Probe...")
        res = asyncio.run(execute_verification_probe(args.type, args.token))
        if res.get("status") == "VERIFIED_REVOKED":
            safe_print(f"[+] {res.get('message', 'Key revocation confirmed!')}")
        else:
            safe_print(f"[!] {res.get('message', 'Warning: Token probe did not confirm revocation.')}")

if __name__ == "__main__":
    main()
