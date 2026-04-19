/** @type {import('next').NextConfig} */
const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '')

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const backendOrigin = trimTrailingSlash(apiBaseUrl.replace(/\/api\/?$/, ''))
const proxyTarget = process.env.NEXT_SERVER_API_PROXY_TARGET
  ? trimTrailingSlash(process.env.NEXT_SERVER_API_PROXY_TARGET)
  : process.env.NODE_ENV === 'development'
    ? backendOrigin
    : null

const uploadsPattern = (() => {
  try {
    const parsed = new URL(backendOrigin)
    const pattern = {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      pathname: '/uploads/**',
    }

    if (parsed.port) {
      pattern.port = parsed.port
    }

    return pattern
  } catch (error) {
    return null
  }
})()

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'readdy.ai',
      },
      ...(uploadsPattern ? [uploadsPattern] : []),
    ],
  },
  async rewrites() {
    if (!proxyTarget) {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: `${proxyTarget}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
