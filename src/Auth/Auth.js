/* eslint-disable no-console */
import auth0 from 'auth0-js';
import AUTH0_CONFIG from './auth0-variables';

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
