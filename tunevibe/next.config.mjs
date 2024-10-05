/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Set to false to disable double rendering in development
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
