// This file is part of the CIRC website.
// It belongs to the code layer and contains the logic for this feature.
// Read it from top to bottom to understand how the page, component, or data flow works.
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  // Use the compiler API because the CLI subprocess returns empty --showConfig
  // output in this build environment.
  experimental: {
    useTypeScriptCli: false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    }
    return config
  },
  allowedDevOrigins: ["192.168.0.102"],
  async redirects() {
    return [
      // Standalone /socials page was folded into /contact.
      { source: "/socials", destination: "/contact", permanent: true },
    ]
  },
  images: {
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // These generated filenames are versioned with the asset content.
        source: "/hero/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

export default nextConfig
