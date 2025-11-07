/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://image.tmdb.org/t/p/w500/**')],
  },
};

export default nextConfig;
