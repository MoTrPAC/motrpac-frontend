const url = new URL(window.location.href);

const AUTH0_CONFIG = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  callbackUrl: `${url.origin}/callback`,
};

export default AUTH0_CONFIG;
