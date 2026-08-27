-- =============================================================================
-- ANVESHAKSUTRA (अन्वेषकसूत्र) - SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- =============================================================================
-- Execute this script in your Supabase Project SQL Editor to initialize all tables,
-- Row Level Security (RLS) policies, indexes, and initial demo records.
-- =============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users & Operator Clearance Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    clearance_level TEXT NOT NULL DEFAULT 'Level 2', -- Level 1 (Auditor), Level 2 (Standard), Level 3 (Lead), Level 4 (Super)
    role TEXT NOT NULL DEFAULT 'Operator',
    pgp_fingerprint TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Digital Identities & Monitored Assets Table
CREATE TABLE IF NOT EXISTS public.identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    identity_type TEXT NOT NULL, -- EMAIL, DOMAIN, API_KEY, REPOSITORY, CLOUD_ACCOUNT
    identity_value TEXT NOT NULL,
    sha256_hash TEXT NOT NULL,
    prefix_5char TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CLEAN', -- CLEAN, EXPOSED, VULNERABLE, COMPROMISED
    centrality_score NUMERIC(4, 2) DEFAULT 0.50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Canary Tokens (Honey-Credentials Deception Network) Table
CREATE TABLE IF NOT EXISTS public.canary_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token_type TEXT NOT NULL, -- AWS_KEY, GITHUB_PAT, DATABASE_URL, SLACK_WEBHOOK
    token_value TEXT UNIQUE NOT NULL,
    memo TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ARMED', -- ARMED, TRIGGERED, REVOKED
    detonation_ip TEXT,
    detonated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Threat Incidents & OSINT Hits Table
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_type TEXT NOT NULL, -- CREDENTIAL_LEAK, API_KEY_EXPOSURE, INFRASTRUCTURE_MENTION, BRAND_SPOOFING
    severity TEXT NOT NULL DEFAULT 'MEDIUM', -- CRITICAL, HIGH, MEDIUM, LOW
    target_value TEXT NOT NULL,
    source TEXT NOT NULL, -- GitHub, Pastebin, Telegram, Dark Forum, Tor Relay
    raw_details TEXT,
    mitigation_command TEXT,
    is_critical BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Immutable Cryptographic Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    evidence_sha256 TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR ULTRA-FAST O(1) LOOKUPS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_identities_prefix ON public.identities(prefix_5char);
CREATE INDEX IF NOT EXISTS idx_canaries_token ON public.canary_tokens(token_value);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON public.incidents(severity);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canary_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public reads for prototype/demo clearance
CREATE POLICY "Allow public read access for active identities" ON public.identities FOR SELECT USING (true);
CREATE POLICY "Allow public read access for canary tokens" ON public.canary_tokens FOR SELECT USING (true);
CREATE POLICY "Allow public read access for incidents" ON public.incidents FOR SELECT USING (true);

-- =============================================================================
-- SEED DATA (INITIAL OPERATOR & CANARIES)
-- =============================================================================
INSERT INTO public.users (username, email, password_hash, clearance_level, role, pgp_fingerprint)
VALUES (
    'admin',
    'operator@anveshaksutra.internal',
    '$2b$12$e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'Level 4',
    'Super Admin',
    'F3A8 99B2 01CD 45FE 8812 77AA 34CD 90E1 F980 BB21'
) ON CONFLICT (username) DO NOTHING;

INSERT INTO public.canary_tokens (token_type, token_value, memo, status)
VALUES 
    ('AWS_KEY', 'AKIA_CANARY_STAGING_99B2', 'Planted in Notion Engineering Runbooks', 'ARMED'),
    ('GITHUB_PAT', 'ghp_canary_deploy_token_77a1', 'Planted in public frontend backup commit diff', 'TRIGGERED')
ON CONFLICT (token_value) DO NOTHING;

INSERT INTO public.incidents (incident_type, severity, target_value, source, raw_details, mitigation_command, is_critical)
VALUES
    ('API Key Exposure', 'CRITICAL', 'sk_live_51Mv9...9f2a', 'GitHub', 'Found in public commit diff in repo frontend-prod-backup.', 'POST /api/v1/containment/revoke-token?token_id=sk_live_51Mv9', true),
    ('Employee Credential', 'HIGH', 'j.smith@defense.internal', 'Pastebin', 'Detected in combo-dump paste Enterprise DB Dump 2026.', 'Force FIDO2 password rotation for user j.smith', false)
ON CONFLICT DO NOTHING;
