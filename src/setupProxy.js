const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    import.meta.env.VITE_ES_ENDPOINT,
    createProxyMiddleware({
      target: import.meta.env.VITE_ES_PROXY_HOST,
      changeOrigin: true,
    }),
  );
};
