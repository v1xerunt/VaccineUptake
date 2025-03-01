import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "development" ? "" : "/vax-track",
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/nirsevimab",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
