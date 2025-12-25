import type { NextConfig } from "next";

const repo = 'totalumbrel.la'; //for correct image directories

const nextConfig: NextConfig = {
  output: 'export',
  // basePath: `/${repo}`,
  // assetPrefix: `/${repo}/`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
