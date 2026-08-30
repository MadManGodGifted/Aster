/** @type {import('next').NextConfig} */
// Keep development and production rendering aligned with App Router defaults.
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === "production" ? ".next-production" : ".next",
};

export default nextConfig;
