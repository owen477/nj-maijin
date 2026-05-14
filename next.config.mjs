/** @type {import('next').NextConfig} */
const nextConfig = {
 output: "standalone",
 images: {
 domains: ["localhost", "picsum.photos"],
 },
 typescript: {
 ignoreBuildErrors: true,
 },
 eslint: {
 ignoreDuringBuilds: true,
 },
};

export default nextConfig;
