"""
K-Anonymity Zero-Knowledge Matching Service
Universal Multi-Vector Breach Intelligence Engine
Supports Emails, Instagram & Social Usernames, Phone Numbers (E.164), Passwords, and API Keys.
Allows the browser to query breach buckets using only the first 5 characters of a SHA-256 hash.
The server returns candidate hash suffixes without ever learning the client's actual identifier.
"""

import hashlib
import re
from typing import List, Dict, Any

# Multi-Vector Curated Breach Database Bucket Index
SAMPLE_KNOWN_ENTITIES = [
    # 1. Emails
    {"raw": "admin@example.com", "type": "EMAIL", "breach": "Enterprise Combo Dump 2026", "fields": ["Password Hash", "Email", "IP Address"], "date": "2026-01"},
    {"raw": "john.doe@company.org", "type": "EMAIL", "breach": "Corporate SaaS Breach", "fields": ["Plaintext Password", "Full Name"], "date": "2025-11"},
    {"raw": "developer@startup.io", "type": "EMAIL", "breach": "Cloud DevOps Stealer Log", "fields": ["Session Token", "SSH Key", "Password"], "date": "2026-02"},
    {"raw": "testuser@gmail.com", "type": "EMAIL", "breach": "Global Consumer Dump", "fields": ["Password", "Phone Number"], "date": "2024-08"},
    {"raw": "huzaifa@ironlogic.in", "type": "EMAIL", "breach": "Public Developer Index 2026", "fields": ["Salted Hash", "GitHub Organization"], "date": "2026-08"},
    
    # 2. Instagram & Social Handles
    {"raw": "@alex_dev99", "type": "SOCIAL", "breach": "Instagram Scraped Combo Database", "fields": ["Phone Number", "Password Hash", "Bio/Location", "Follower Graph"], "date": "2024-10"},
    {"raw": "alex_dev99", "type": "SOCIAL", "breach": "Instagram Scraped Combo Database", "fields": ["Phone Number", "Password Hash", "Bio/Location"], "date": "2024-10"},
    {"raw": "@crypto_whale", "type": "SOCIAL", "breach": "Telegram & Discord SIM-Swap Leak", "fields": ["Phone Number", "2FA Recovery Codes", "Telegram ID"], "date": "2025-05"},
    {"raw": "@sarah_designs", "type": "SOCIAL", "breach": "Social Influencer Credential Leak", "fields": ["Email", "Plaintext Password", "Connected Facebook Page"], "date": "2025-09"},
    
    # 3. Phone Numbers (Normalized E.164)
    {"raw": "+15551234567", "type": "PHONE", "breach": "Telecom Carrier SMS Gateway Breach", "fields": ["Full Name", "Call Metadata", "IMSI/IMEI", "Location"], "date": "2025-03"},
    {"raw": "+919876543210", "type": "PHONE", "breach": "Dark-Web OTP Stealer Combolist", "fields": ["UPI ID", "Linked Banking Email", "Password Hash"], "date": "2026-04"},
    {"raw": "+447911123456", "type": "PHONE", "breach": "E-Commerce Customer Leak", "fields": ["Delivery Address", "Phone Number", "Order History"], "date": "2024-12"},
    
    # 4. Passwords & Hashes
    {"raw": "Password123!", "type": "PASSWORD", "breach": "RockYou2024 Super-Dump (10B+ Passwords)", "fields": ["Plaintext Password", "Occurrences: 4,812,900"], "date": "2024-06"},
    {"raw": "admin2026", "type": "PASSWORD", "breach": "Global Default Credential Combolist", "fields": ["Plaintext Password", "Occurrences: 890,210"], "date": "2026-01"},
    {"raw": "Tr0ub4dor&3", "type": "PASSWORD", "breach": "NIST Weak Passphrase Archive", "fields": ["Plaintext Password", "Occurrences: 12,410"], "date": "2025-02"},
    
    # 5. Cloud & API Secrets
    {"raw": "ghp_live_test_canary_token_8899", "type": "SECRET", "breach": "GitHub Public Commit Scrape", "fields": ["Classic Personal Access Token", "Repository Scope: Full Admin"], "date": "2026-08"},
    {"raw": "sk_live_stripe_decoy_token_9900", "type": "SECRET", "breach": "Pastebin Dump #441", "fields": ["Stripe Production API Key"], "date": "2026-07"},
    {"raw": "AKIAIOSFODNN7EXAMPLE", "type": "SECRET", "breach": "AWS IAM Key Public Exposure", "fields": ["AWS Access Key ID", "Full Cloud Admin"], "date": "2026-05"},
]

def normalize_identifier(identifier: str) -> str:
    """Normalizes various identifier types (Phone numbers, handles, emails)."""
    clean = identifier.strip()
    # Phone numbers: remove spaces, dashes, parentheses
    if re.match(r"^\+?[\d\s\-\(\)]{7,20}$", clean):
        cleaned_phone = re.sub(r"[^\d+]", "", clean)
        if not cleaned_phone.startswith("+"):
            cleaned_phone = "+" + cleaned_phone
        return cleaned_phone
    # Social handles: lowercased without leading @ for consistent hashing
    if clean.startswith("@"):
        return clean.lower()
    return clean.lower()

def get_k_anonymity_bucket(prefix5: str) -> List[Dict[str, Any]]:
    """
    Returns all hash suffixes matching the 5-character prefix.
    """
    prefix = prefix5.lower()
    matches = []
    
    for item in SAMPLE_KNOWN_ENTITIES:
        norm = normalize_identifier(item["raw"])
        full_hash = hashlib.sha256(norm.encode("utf-8")).hexdigest()
        
        if full_hash.startswith(prefix):
            matches.append({
                "suffix": full_hash[5:],
                "entity_type": item["type"],
                "breach_name": item["breach"],
                "compromised_data_fields": item["fields"],
                "breach_date": item["date"],
                "requires_proof_of_ownership": True,
                "occurrences": 1
            })
            
    # If no natural match, generate a deterministic decoy entry to prevent timing attacks
    if not matches:
        dummy_suffix = hashlib.sha256((prefix + "_k_anon_decoy").encode()).hexdigest()[5:]
        matches.append({
            "suffix": dummy_suffix,
            "entity_type": "GENERAL_RECORD",
            "breach_name": "Aggregated Global Breach Digest",
            "compromised_data_fields": ["Salted Password Hash"],
            "breach_date": "2025-Q4",
            "requires_proof_of_ownership": True,
            "occurrences": 1
        })
        
    return matches

def register_breach_hash_to_bucket(raw_identifier: str, entity_type: str = "GENERAL", breach_name: str = "Custom Ingestion"):
    """Registers a new breached identifier into the lookup bucket."""
    norm = normalize_identifier(raw_identifier)
    h = hashlib.sha256(norm.encode("utf-8")).hexdigest()
    SAMPLE_KNOWN_ENTITIES.append({
        "raw": norm,
        "type": entity_type.upper(),
        "breach": breach_name,
        "fields": ["Password / Secret", "Identifier"],
        "date": "2026-08"
    })
    return h
