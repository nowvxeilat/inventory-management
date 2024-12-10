/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'placehold.co'],
  },
  swcMinify: true,
}

module.exports = nextConfig
