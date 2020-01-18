import auth0 from 'auth0-js';
import AUTH0_CONFIG from './auth0-variables';

/**
 * A class for Auth0 authentication.
 * @class
 * 
 * @property expiresAt                A timestamp string parsed from localStorage.
 * @property expirationCheckInterval  A reference to the setInterval call.
 * 
 */
class Auth {
  expiresAt;
  expirationCheckInterval;
  intervalLength = 2 * 60 * 60 * 1000;

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
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setSession = this.setSession.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.checkExpirationInterval();
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    // Clear all local storage items upon logging out
    localStorage.clear();
    clearInterval(this.expirationCheckInterval);
    // Clear Auth0 session cookie to prevent Auth0 SSO from automatically
    // authenticating users of 'Username-Password-Authentication' connection
    this.auth0.logout({
      returnTo: window.location.origin
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    this.expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('id_token_payload', JSON.stringify(authResult.idTokenPayload));
    localStorage.setItem('expires_at', this.expiresAt);

    // schedule expiration check interval
    this.checkExpirationInterval();
  }

  handleAuthentication(cb) {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
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

  isAuthenticated() {
    if (
      !localStorage.getItem('access_token') ||
      !localStorage.getItem('id_token') ||
      !localStorage.getItem('id_token_payload') ||
      !localStorage.getItem('expires_at')
    ) {
      return false;
    }

    this.expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < this.expiresAt;
  }

  getProfile(cb) {
    const idTokenPayload = JSON.parse(localStorage.getItem('id_token_payload'));
    if (!idTokenPayload) {
      throw new Error('No id token payload found');
    }
    const profile = {
      name: idTokenPayload.name,
      nickname: idTokenPayload.nickname,
      email: idTokenPayload.email,
      picture: idTokenPayload.picture,
      user_metadata: idTokenPayload['https://motrpac.org/user_metadata'],
      app_metadata: idTokenPayload['https://motrpac.org/app_metadata']
    }
    cb(null, profile);
  }

  endSession() {
    this.expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const timeout = this.expiresAt - Date.now();
    if (timeout <= 0) {
      this.logout();
    }
  }

  // check periodically to log out if access token expires
  checkExpirationInterval() {
    if (this.expiresAt != undefined && this.expiresAt != null) {
      this.expirationCheckInterval = setInterval(() => {
        this.endSession();
      }, this.intervalLength);
    }
  }
}

export default Auth;
