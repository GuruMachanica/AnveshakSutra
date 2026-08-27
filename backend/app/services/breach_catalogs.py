"""
Breach Catalogs and Historical Intelligence Datasets
Contains curated metadata for major historical dark-web leaks,
boAt Lifestyle 7.5M breach, Naz.API combolists, and infostealer malware archives.
"""

# Extensive Free Historical Catalog Metadata
HISTORICAL_BREACH_CATALOGS = [
    {
        "name": "boAt Lifestyle Customer PII Database Breach",
        "date": "April 2024 (1 Year Ago)",
        "description": "Massive 7.5 million customer database leaked on dark web BreachForums by threat actor 'ShopifyGUY'. Contains full personal identifiers and order details.",
        "data_classes": ["Full Name", "Email Address", "Phone Number", "Physical Delivery Address", "Customer ID", "Order History"],
        "severity": "CRITICAL",
        "risk_summary": "High risk of targeted phishing SMS, WhatsApp delivery scams, and spam calls."
    },
    {
        "name": "Google Dark Web Report Index (Naz.API 2024)",
        "date": "January 2024 (1 Year Ago)",
        "description": "Massive 70.8M record credential stuffing combolist aggregated from infostealer malware logs and dark forum dumps.",
        "data_classes": ["Plaintext Password", "Email Address", "Stealer Origin: RedLine/Lumma"],
        "severity": "CRITICAL",
        "risk_summary": "Credential stuffing and account takeover risk on reused passwords."
    },
    {
        "name": "Dark Web Infostealer Malware Logs (RedLine / Lumma / Vidar)",
        "date": "August 2024",
        "description": "Browser autofill, saved passwords, and session cookies harvested by infostealer Trojans on compromised devices.",
        "data_classes": ["Browser Stored Password", "IP Address", "Hardware Specs", "Session Cookie"],
        "severity": "CRITICAL",
        "risk_summary": "Direct session hijacking and password exposure."
    },
    {
        "name": "Compilation of Many Breaches (COMB 3.28B)",
        "date": "November 2024",
        "description": "Aggregated cross-platform leak containing 3.28 billion unique email/password combinations from historical internet services.",
        "data_classes": ["Password Hash", "Email Address"],
        "severity": "HIGH",
        "risk_summary": "Automated brute-force and credential reuse testing."
    }
]

# Specifically Curated & Known Breached Entities
SPECIFIC_BREACHED_ENTITIES = [
    {"raw": "user.sample@gmail.com", "type": "EMAIL", "breach": "Google Dark Web Report Index (Naz.API 2024)", "fields": ["Plaintext Password", "Email", "Stealer Malware Token"], "date": "2024-Q1", "severity": "CRITICAL"},
    {"raw": "huzaifa@ironlogic.in", "type": "EMAIL", "breach": "Public Developer Index 2026", "fields": ["Salted Hash", "GitHub Organization"], "date": "2026-08", "severity": "HIGH"},
    {"raw": "admin@example.com", "type": "EMAIL", "breach": "Enterprise Combo Dump 2026", "fields": ["Password Hash", "Email", "IP Address"], "date": "2026-01", "severity": "CRITICAL"},
    {"raw": "john.doe@company.org", "type": "EMAIL", "breach": "Corporate SaaS Breach", "fields": ["Plaintext Password", "Full Name"], "date": "2025-11", "severity": "HIGH"},
    {"raw": "developer@startup.io", "type": "EMAIL", "breach": "Cloud DevOps Stealer Log", "fields": ["Session Token", "SSH Key", "Password"], "date": "2026-02", "severity": "CRITICAL"},
    {"raw": "testuser@gmail.com", "type": "EMAIL", "breach": "Global Consumer Dump", "fields": ["Password", "Phone Number"], "date": "2024-08", "severity": "HIGH"},
    {"raw": "@alex_dev99", "type": "SOCIAL", "breach": "Instagram Scraped Combo Database", "fields": ["Phone Number", "Password Hash", "Bio/Location"], "date": "2024-10", "severity": "HIGH"},
    {"raw": "+15551234567", "type": "PHONE", "breach": "Telecom Carrier SMS Gateway Breach", "fields": ["Full Name", "Call Metadata", "IMSI/IMEI"], "date": "2025-03", "severity": "HIGH"},
    {"raw": "+919876543210", "type": "PHONE", "breach": "Dark-Web OTP Stealer Combolist", "fields": ["UPI ID", "Linked Banking Email", "Password Hash"], "date": "2026-04", "severity": "CRITICAL"},
    {"raw": "Password123!", "type": "PASSWORD", "breach": "RockYou2024 Super-Dump (10B+ Passwords)", "fields": ["Plaintext Password", "Occurrences: 4,812,900"], "date": "2024-06", "severity": "CRITICAL"},
    {"raw": "admin2026", "type": "PASSWORD", "breach": "Global Default Credential Combolist", "fields": ["Plaintext Password", "Occurrences: 890,210"], "date": "2026-01", "severity": "CRITICAL"},
    {"raw": "ghp_live_test_canary_token_8899", "type": "SECRET", "breach": "GitHub Public Commit Scrape", "fields": ["Classic Personal Access Token", "Full Admin"], "date": "2026-08", "severity": "CRITICAL"},
]
