/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable output optimization for production
    output: 'standalone',
    // Disable image optimization if not needed
    images: {
      unoptimized: true,
    },
    // Add proper CORS headers in production
    async headers() {
      return [
        {
          source: '/api/emails/incoming',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,POST' },
            { key: 'Access-Control-Allow-Headers', value: 'Authorization, Content-Type' },
          ],
        },
      ];
    },
  }
  
  module.exports = nextConfig