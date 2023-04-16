/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

module.exports = nextConfig;
