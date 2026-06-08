/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Escape hatch for low-disk machines: DISABLE_WEBPACK_CACHE=1 turns off Next's
    // persistent filesystem cache (the large .next/cache pack files). Default behavior
    // is unchanged.
    if (process.env.DISABLE_WEBPACK_CACHE === "1") {
      config.cache = false;
    }
    return config;
  },
};
module.exports = nextConfig;
