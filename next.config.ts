import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  // Memory optimization for builds
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}

export default nextConfig