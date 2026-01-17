
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;",
          },
        ],
      },
    ]
  },
}

// IMPORTANT: This application requires Convex environment variables to run correctly.
// A server-side exception will occur if the following variables are not set in your
// deployment environment (e.g., Vercel, Netlify, or a self-hosted server):
//
// - CONVEX_DEPLOYMENT
// - NEXT_PUBLIC_CONVEX_URL
// - CONVEX_AUTH_SECRET
//
// You can find these values in your Convex project settings.

export default nextConfig
