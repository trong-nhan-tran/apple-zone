import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "qklerkksbvcdayngbhxa.supabase.co"],
    // If you have other domains, keep them here
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
};

export default nextConfig;
