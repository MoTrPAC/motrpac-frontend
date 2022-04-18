const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/search/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_ES_PROXY_HOST,
      changeOrigin: true,
    })
  );
};
