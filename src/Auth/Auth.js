import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
  expiresAt;
  tokenRenewalTimeout;

  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: AUTH_CONFIG.domain,
      clientID: AUTH_CONFIG.clientId,
      redirectUri: AUTH_CONFIG.callbackUrl,
      responseType: 'token id_token',
      scope: 'openid profile',
    });

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setSession = this.setSession.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.scheduleRenewal();
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('id_token_payload');
    localStorage.removeItem('expires_at');
    clearTimeout(this.tokenRenewalTimeout);
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('id_token_payload', JSON.stringify(authResult.idTokenPayload));
    localStorage.setItem('expires_at', expiresAt);

    // schedule a token renewal
    this.scheduleRenewal();
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

    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
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

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(`Could not get a new token (${err.error}: ${err.error_description}).`);
      }
    });
  }

  scheduleRenewal() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const timeout = expiresAt - Date.now();
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout);
    }
  }
}
