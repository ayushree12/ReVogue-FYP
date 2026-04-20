const BASE_URL = process.env.KHALTI_BASE_URL || 'https://a.khalti.com/api/v2/epayment';

const KHALTI_CONFIG = {
  BASE_URL,
  INITIATE_URL: process.env.KHALTI_INITIATE_URL || `${BASE_URL}/initiate/`,
  LOOKUP_URL: process.env.KHALTI_LOOKUP_URL || `${BASE_URL}/lookup/`,
  SECRET_KEY: process.env.KHALTI_SECRET_KEY || '57728da13a524ca38d71226086d67642',
  PUBLIC_KEY: process.env.KHALTI_PUBLIC_KEY || 'f4f8e03620bd42b1ad56e2778bd07430',
  WEBSITE_URL: process.env.WEBSITE_URL || 'http://localhost:5173',
  TIMEOUT: Number(process.env.KHALTI_TIMEOUT) || 45000,
  MAX_RETRIES: Number(process.env.KHALTI_MAX_RETRIES) || 15
};

module.exports = KHALTI_CONFIG;
