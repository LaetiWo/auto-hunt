/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.appwrite.io", // Accepte tous les sous-domaines
        pathname: "/v1/storage/buckets/**",
      },
    ],
  },
};

export default nextConfig;
