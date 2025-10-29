/**
 * @file Next.js configuration enabling the src directory structure.
 * @see https://nextjs.org/docs/app/building-your-application/configuring
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true
  }
};

module.exports = nextConfig;
