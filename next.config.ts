import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Disable static optimization for debugging
  output: 'standalone',
}

export default nextConfig