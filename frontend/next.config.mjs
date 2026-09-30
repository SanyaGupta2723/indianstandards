/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/recommend',
        destination: 'http://13.49.102.227:8000/api/recommend/',
      },
      {
        source: '/api/recommend/',
        destination: 'http://13.49.102.227:8000/api/recommend/',
      },
      {
        source: '/api/upload/pdf/recommend',
        destination: 'http://13.49.102.227:8000/api/upload/pdf/recommend',
      },
      {
        source: '/api/upload/pdf/recommend/',
        destination: 'http://13.49.102.227:8000/api/upload/pdf/recommend',
      },
    ]
  },
}

export default nextConfig
