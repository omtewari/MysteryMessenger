/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nodeMiddleware: true, // 👈 enable Node.js middleware support
  },
};

export default nextConfig;