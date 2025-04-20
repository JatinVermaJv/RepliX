/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['yt3.ggpht.com', 'i.ytimg.com'],
  },
  // Enable static optimization where possible
  output: 'standalone',
  // Optimize images
  images: {
    domains: ['yt3.ggpht.com', 'i.ytimg.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Enable compression
  compress: true,
  // Optimize fonts
  optimizeFonts: true,
  // Enable React strict mode
  reactStrictMode: true,
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
      {
        source: '/fonts/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
    ];
  },
  // Optimize build output
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react'],
  },
}

module.exports = nextConfig 