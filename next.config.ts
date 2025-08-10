import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    apiRoute: 'http://localhost:4000/'
  }
};

export default nextConfig;
