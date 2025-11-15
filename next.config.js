/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove output: 'export' since we need API routes
    images: {
      unoptimized: true
    }
  }
  
  module.exports = nextConfig