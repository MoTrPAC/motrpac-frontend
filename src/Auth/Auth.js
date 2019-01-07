import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
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
  }

  handleAuthentication(cb) {
    this.auth0.parseHash((err, authResult) => {
      if (err) {
        console.log(`${err.error}: ${err.errorDescription}`);
        console.log('Could not authenticate');
        cb(err);
      } else if (authResult && authResult.accessToken && authResult.idToken) {
        console.log(authResult);
        this.setSession(authResult);
        cb(null, authResult);
      } else {
        console.log(`Unexpected format of authResult: ${authResult}`);
        cb(new Error('Unexpected format of authResult'));
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

    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
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
      user_metadata: idTokenPayload.user_metadata,
      app_metadata: idTokenPayload.app_metadata
    }
    cb(null, profile);
  }
}
