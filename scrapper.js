const Apify = require("Apify");
const axios = require("axios");
const request = require("request");
const cheerio = require("cheerio");
Apify.client.setOptions({ token: "dWjrrmniw3rz7aZL2NJJi7AmM" });

module.exports = {
  fbScrapper: async () => {
    const run = await Apify.call("pocesar/facebook-pages-scraper", {
      startUrls: [
        {
          url: "https://www.facebook.com/palmmind.np/",
        },
      ],
      language: "en-US",
      maxPosts: 3,
      maxPostDate: "2020-01-01",
      maxPostComments: 3,
      maxCommentDate: "2020-01-01",
      maxReviews: 3,
      maxReviewDate: "2020-01-01",
      proxyConfiguration: {
        useApifyProxy: true,
      },
    });

    console.log("Actor finished, here is the output:");
    const res = await axios.get(
      `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=dWjrrmniw3rz7aZL2NJJi7AmM`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ); // Getting the data from DarkSky
    console.log(res);
  },
  instaScrapper: async () => {
    const run = await Apify.call("jaroslavhejlek/instagram-scraper", {
      search: "Nature",
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: [],
      },
      extendOutputFunction: ($) => {
        return {};
      },
    });

    console.log("Actor finished, here is the output:");
    console.dir(run.output);
  },
  theQuandooScrapper: async () => {
    var options = {
      method: "GET",
      url: "https://www.quandoo.com.au/place/butcher-and-the-farmer-40997",
    };
    request(options, (err, res, body) => {
      if (err) return console.error(err + "asdf");

      let $ = cheerio.load(body);

      // let title = $("title");
      let title = $(".sc-1wxdvwo-3");
      let rating = $(".cwRLQU span");
      let image = $(".jFgfXP img").attr("src");

      console.log(title.text());
      console.log(rating.text());
      console.log(image);
    });
  },
  theForkScrapper: async () => {
    const run = await Apify.call("apify/web-scraper", {
      runMode: "DEVELOPMENT",
      startUrls: [
        {
          url: "https://apify.com",
        },
      ],
      linkSelector: "a[href]",
      pseudoUrls: [
        {
          purl: "https://apify.com[(/[\\w-]+)?]",
        },
      ],
      // The function accepts a single argument: the "context" object.
      pageFunction:
        // For a complete list of its properties and functions,
        // see https://apify.com/apify/web-scraper#page-function
        async function pageFunction(context) {
          // jQuery is handy for finding DOM elements and extracting data from them.
          // To use it, make sure to enable the "Inject jQuery" option.
          const $ = context.jQuery;
          const pageTitle = $("title").first().text();

          // Print some information to actor log
          context.log.info(`URL: ${context.request.url}, TITLE: ${pageTitle}`);

          // Manually add a new page to the queue for scraping.
          // To make this work, make sure the "Use request queue" option is enabled.
          context.enqueueRequest({ url: "http://www.example.com" });

          // Return an object with the data extracted from the page.
          // It will be stored to the resulting dataset.
          return {
            url: context.request.url,
            pageTitle,
          };
        },
      proxyConfiguration: {
        useApifyProxy: false,
      },
      initialCookies: [],
      waitUntil: ["networkidle2"],
      breakpointLocation: "NONE",
      customData: {},
    });

    console.log("Actor finished, here is the output:");
    console.dir(run.output);
  },
  theOpenTableScrapper: async () => {
    var options = {
      method: "GET",
      url: "https://www.opentable.com/r/butcher-and-the-farmer-london-2",
    };
    request(options, (err, res, body) => {
      if (err) return console.error(err);

      let $ = cheerio.load(body);

      // let title = $("title");
      let title = $(".`a6481dc2 ._4a4e7a6a");

      console.log(title.text());
    });
  },
};
