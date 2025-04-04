import CopyPlugin from "copy-webpack-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure that webpack resolves the "react-server" entry when available.
      config.resolve.mainFields = ["react-server", "module", "main"];

      // Optionally, externalize node modules that shouldn't be bundled:
      config.externals = config.externals || [];
      config.externals.push({
        "@tensorflow/tfjs-node": "commonjs @tensorflow/tfjs-node",
        "@mapbox/node-pre-gyp": "commonjs @mapbox/node-pre-gyp",
        nock: "commonjs nock",
        "node-gyp": "commonjs node-gyp",
        npm: "commonjs npm",
      });

      // Copy package.json if needed.
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: "./package.json",
              to: "./package.json",
            },
          ],
        })
      );
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/predict",
        destination: "https://staging.skoragents.ai/predict",
      },
    ];
  },
};

export default nextConfig;
