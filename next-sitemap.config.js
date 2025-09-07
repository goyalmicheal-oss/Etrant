/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://etrant.akkhil.dev",
  generateRobotsTxt: true, // create robots.txt
  sitemapSize: 7000,

  // Exclude private/non-SEO pages
  exclude: ["/auth/*", "/api/*", "/(protected)/*"],

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api", "/(protected)"] },
    ],
  },
};
