// craco.config.js
const path = require("path");
require("dotenv").config();

// Check if we're in development/preview mode (not production build)
// Craco sets NODE_ENV=development for start, NODE_ENV=production for build
const isDevServer = process.env.NODE_ENV !== "production";

// Environment variable overrides
const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

// Conditionally load health check modules only if enabled
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

let webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {

      // SEO FIX (2026-09-17): CRA's production HtmlWebpackPlugin runs
      // `minify.minifyJS = true`, which feeds inline <script> bodies through
      // Terser. Terser does NOT understand `application/ld+json` — it parses
      // the JSON object literal as a JS block statement with no side effects
      // and DROPS it, so every inline JSON-LD block in public/index.html was
      // being emitted to the live site as an empty `{}`. That silently killed
      // the Organization, WebSite, SoftwareApplication and FAQPage rich
      // structured data (exactly the schema types search + AI crawlers use).
      // Disabling only `minifyJS` preserves all other HTML minification and
      // the webpack JS bundle is still minified independently, so there is no
      // bundle-size cost. Verified by building + inspecting build/index.html.
      for (const plugin of webpackConfig.plugins || []) {
        if (plugin && plugin.constructor && plugin.constructor.name === "HtmlWebpackPlugin") {
          const m = plugin.options && plugin.options.minify;
          if (m && typeof m === "object") {
            m.minifyJS = false;
          } else if (m === true) {
            plugin.options.minify = {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyCSS: true,
              minifyJS: false,
              minifyURLs: true,
            };
          }
        }
      }

      // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
        ],
      };

      // Add health check plugin to webpack if enabled
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }
      return webpackConfig;
    },
  },
};

webpackConfig.devServer = (devServerConfig) => {
  // Add health check endpoints if enabled
  if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      // Call original setup if exists
      if (originalSetupMiddlewares) {
        middlewares = originalSetupMiddlewares(middlewares, devServer);
      }

      // Setup health endpoints
      setupHealthEndpoints(devServer, healthPluginInstance);

      return middlewares;
    };
  }

  return devServerConfig;
};

module.exports = webpackConfig;
