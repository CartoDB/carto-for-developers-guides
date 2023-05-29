import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client: Auth0Client

export async function initAuth() {
  let accessToken: string | undefined;

  const clientId = import.meta.env.VITE_CLIENT_ID;
  auth0Client = await createAuth0Client({
    domain: 'auth.carto.com',
    clientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'carto-cloud-native-api'
    }
  })

  if (location.search.includes('state=') && 
      (location.search.includes('code=') || 
      location.search.includes('error='))) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/');
  }

  const isAuthenticated = await auth0Client.isAuthenticated();
  const appEl = document.getElementById('app');

  if (isAuthenticated) {
    appEl?.classList.add('isAuthenticated');
    
    const userProfile = await auth0Client.getUser();
    accessToken = await auth0Client.getTokenSilently();

    if (userProfile) {
      const profileEl = document.getElementById('profile')!;
      profileEl.innerHTML = `
            <p>${userProfile.name}</p>
            <img width="50px" height="50px" src='${userProfile.picture}' />
          `;
    }
    
  } else {
    appEl?.classList.remove('isAuthenticated');
  }
  // Logout
  const logoutButton = document.getElementById('logout');
  logoutButton?.addEventListener('click', (e) => {
    e.preventDefault();
    auth0Client.logout();
  });

  // Login
  const loginButton = document.getElementById('login');
  loginButton?.addEventListener('click', (e) => {
    e.preventDefault();
    auth0Client.loginWithRedirect();
  });
  return accessToken
}
