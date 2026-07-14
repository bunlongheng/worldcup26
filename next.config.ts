import type { NextConfig } from "next";

// Next.js dev (Turbopack/HMR) evaluates code via eval(); production never does.
// iOS Safari strictly enforces CSP, so without 'unsafe-eval' the dev bundle
// silently fails to run on a phone and the page becomes non-interactive.
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  "img-src 'self' data: https://flagcdn.com",
  "media-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Never cache the HTML document, so a new deploy is picked up immediately
      // (the hashed /_next/static assets it points to stay immutably cached).
      { source: "/", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
    ];
  },
};

export default nextConfig;
