/* eslint-disable no-console */
import auth0 from 'auth0-js';
import * as jose from 'jose';
import AUTH0_CONFIG from './auth0-variables';

async function createJWT(email) {
  const secretKey = new TextEncoder().encode(process.env.REACT_APP_JWT_SIGNING_SECRET);

  const jwt = await new jose.SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey);

  return jwt;
}

/**
 * A class for Auth0 authentication.
 * @class
 */
class Auth {
  /**
   * @constructor
   */
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: AUTH0_CONFIG.domain,
      clientID: AUTH0_CONFIG.clientId,
      redirectUri: AUTH0_CONFIG.callbackUrl,
      responseType: 'token id_token',
      scope: 'openid profile',
    });

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    // Clear all local storage items upon logging out
    localStorage.clear();
    // Clear Auth0 session cookie to prevent Auth0 SSO from automatically
    // authenticating users of 'Username-Password-Authentication' connection
    this.auth0.logout({
      returnTo: window.location.origin,
    });
  }

  handleAuthentication(cb) {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // Declare 'idTokenPayload' property for the 'getProfile' method
        this.idTokenPayload = authResult.idTokenPayload;
        // Set the expiration time local storage item
        this.expiresAt = JSON.stringify(
          authResult.expiresIn * 1000 + new Date().getTime(),
        );
        localStorage.setItem('expires_at', this.expiresAt);
        const { userType } = this.idTokenPayload['https://motrpac.org/user_metadata'];
        // Create a date object for cookie expiration
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        // Set the cookie name and value
        const name = 'jwt';
        // Set the cookie only if the user is internal
        if (userType === 'internal') {
          createJWT(this.idTokenPayload.email).then((token) => {
            document.cookie = `${name}=${token}; Domain=.motrpac-data.org; Path=/; Expires=${expirationDate.toUTCString()}; HttpOnly; Secure; SameSite=Strict;`;
          });
        }

        cb(null, authResult);
      } else if (err) {
        console.log(`${err.error}: ${err.errorDescription}`);
        console.log('Could not authenticate');
        cb(err);
      } else {
        console.log(`Unexpected error encountered: ${authResult}`);
        cb(new Error('Unexpected error encountered'));
      }
    });
  }

  getProfile(cb) {
    this.profile = {
      name: this.idTokenPayload.name,
      nickname: this.idTokenPayload.nickname,
      email: this.idTokenPayload.email,
      picture: this.idTokenPayload.picture,
      user_metadata: this.idTokenPayload['https://motrpac.org/user_metadata'],
      app_metadata: this.idTokenPayload['https://motrpac.org/app_metadata'],
    };
    cb(null, this.profile);
  }
}

export default Auth;
