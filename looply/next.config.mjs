import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: []
  },
  // Monorepo: hoisted lockfile at repo root — avoid wrong tracing root warning
  outputFileTracingRoot: path.join(__dirname, "..")
};

export default nextConfig;
