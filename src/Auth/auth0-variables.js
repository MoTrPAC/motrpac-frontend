const url = new URL(window.location.href);

export const AUTH0_CONFIG = {
  domain: 'motrpac-project.auth0.com',
  clientId: '4dUo4JxLlZvCtFVCw21Nh0ZRKyznluAZ',
  callbackUrl: `${url.origin}/callback`
};
