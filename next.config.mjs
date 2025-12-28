
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

// IMPORTANT: This application requires Supabase environment variables to run correctly.
// A server-side exception will occur if the following variables are not set in your
// deployment environment (e.g., Vercel, Netlify, or a self-hosted server):
//
// - NEXT_PUBLIC_SUPABASE_URL
// - NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// You can find these values in your Supabase project's API settings.

export default nextConfig
