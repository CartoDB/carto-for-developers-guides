import { createAuth0Client } from '@auth0/auth0-spa-js';
import { executeRequest } from './api.js';
const scopes = [
  'read:current_user',
  'update:current_user',
  'read:connections',
  'write:connections',
  'read:maps',
  'write:maps',
  'read:account',
  'admin:account',
]

let auth0Client, accessToken;

async function initAuth() {
  const clientId = import.meta.env.VITE_CLIENT_ID
  auth0Client = await createAuth0Client({
    domain: 'auth.carto.com',
    clientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
      scopes: scopes.join(' '),
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
  const loggedContainer = document.getElementById('loggedContainer');
  loggedContainer.style.display = isAuthenticated ? 'block' : 'none';

  if (isAuthenticated) {
    const userProfile = await auth0Client.getUser();
    accessToken = await auth0Client.getTokenSilently();

    const profileEl = document.getElementById('profile');
    profileEl.innerHTML = `
            <p>${userProfile.name}</p>
            <img src='${userProfile.picture}' />
          `;
    
    const accessTokenEl = document.getElementById('accessToken');
    accessTokenEl.innerHTML = `${accessToken.substring(0, 10)}...`;
   
    const loginEl = document.getElementById('login');
    loginEl.style.display = 'none';
  }
}

// Logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', (e) => {
  e.preventDefault();
  auth0Client.logout();
});

// Login
const loginButton = document.getElementById('login');
loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  auth0Client.loginWithRedirect();
});

// Copy to clipboard
const copyToClipboardButton = document.getElementById('copyToClipboard');
copyToClipboardButton.addEventListener('click', (e) => {
  e.preventDefault();
  navigator.clipboard.writeText(accessToken);
});

// Request to clipboard
const copyRequestutton = document.getElementById('requestSQLAPI');
copyRequestutton.addEventListener('click', (e) => {
  e.preventDefault();
  executeRequest(accessToken);
});


initAuth()