const baseUrl = process.env.SITE_URL;

export const isProduction = () => {
  let env = process.env.APP_ENV;

  return env == "production";
};

export const ImgError = (source) => {
  source.target.onerror = null;
  source.target.style.display = "none";
};

export const detectRobot = (userAgent) => {
  const robots = new RegExp(
    [
      /bot/,
      /spider/,
      /crawl/, // GENERAL TERMS
      /APIs-Google/,
      /AdsBot/,
      /Googlebot/, // GOOGLE ROBOTS
      /mediapartners/,
      /Google Favicon/,
      /FeedFetcher/,
      /Google-Read-Aloud/,
      /DuplexWeb-Google/,
      /googleweblight/,
      /bing/,
      /yandex/,
      /baidu/,
      /duckduck/,
      /yahoo/, // OTHER ENGINES
      /ecosia/,
      /ia_archiver/,
      /facebook/,
      /instagram/,
      /pinterest/,
      /reddit/, // SOCIAL MEDIA
      /slack/,
      /twitter/,
      /whatsapp/,
      /youtube/,
      /semrush/, // OTHER
    ]
      .map((r) => r.source)
      .join("|"),
    "i"
  ); // BUILD REGEXP + "i" FLAG

  return robots.test(userAgent);
};
export const processThemeCookie = (req) => {
  const cookie = req.headers ? req.headers.cookie : null;
  const themeCookie = getHeaderCookie("theme", cookie);
  const theme = themeCookie !== null ? themeCookie : "light";

  return theme;
};
export const processSSR = async (userAgent, modelQuery, parameters) => {
  const response = {
    props: {},
  };

  // const isRobot = true;
  const isRobot = detectRobot(userAgent);

  if (!isRobot) {
    response.props = parameters;

    return response;
  }

  const ssrData = await modelQuery(parameters);

  response.props = {
    ssrData,
    isRobot,
  };

  return response;
};

export const getHeaderCookie = (name, source) => {
  var nameEQ = name + "=";

  if (!source) return null;

  var ca = source.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const formatUrl = (target) => {
  let newUrl = target.replace("&", "%26");

  return newUrl;
};

const sitemapSkeleton = (children, type) => {
  let skeletonHeader = type == "index" ? "sitemapindex" : "urlset";

  return `<?xml version="1.0" encoding="UTF-8"?>
    <${skeletonHeader} xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${children}</${skeletonHeader}>`;
};

export const createSitemap = (staticUrls, type = "index") => {
  let skeletonHeader = type == "index" ? "sitemap" : "url";

  const staticPages = staticUrls.map((url) => {
    return `${baseUrl}/${url}`;
  });

  const items = staticPages
    .map((url) => {
      return `
        <${skeletonHeader}>
            <loc>${formatUrl(url)}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </${skeletonHeader}>
        `;
    })
    .join("");

  return sitemapSkeleton(items, type);
};

export const parseSitemaps = (sitemaps, type = "index") => {
  let skeletonHeader = type == "index" ? "sitemap" : "url";

  const items = sitemaps
    .map((target) => {
      let hasLastMod = target.hasOwnProperty("lastMod");
      let renderLocation = `<loc>${formatUrl(target.location)}</loc>`;

      let renderTarget = hasLastMod
        ? `<lastmod>${target.lastMod}</lastmod>`
        : ``;

      let renderItem = `
        <${skeletonHeader}>
          ${renderLocation}
          ${renderTarget}
        </${skeletonHeader}>
      `;

      return renderItem;
    })
    .join("");

  return sitemapSkeleton(items, type);
};
