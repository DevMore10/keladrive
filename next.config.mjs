/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "hidden-echidna-725.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
