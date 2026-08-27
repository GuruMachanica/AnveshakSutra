/**
 * Centralized Application Environment Configuration
 * All API and external endpoints are read dynamically from .env
 */

export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://anveshaksutra.onrender.com/api/v1' : 'http://localhost:8000/api/v1'),
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  IS_PROD: import.meta.env.PROD,
};
