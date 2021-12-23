let routes = [];
let sitemapRoutes = require("./routes-sitemaps");

//Sitemap routes
sitemapRoutes.map((route) => routes.push(route));

module.exports = {
  swcMinify: false,
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  publicRuntimeConfig: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  async rewrites() {
    return routes;
  },
};
