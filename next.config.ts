/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.onurcompany.com', 'static.vecteezy.com'], // Add your external hostname here
  },
};

module.exports = nextConfig;
