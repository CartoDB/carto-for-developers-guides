import { createAuth0Client } from '@auth0/auth0-spa-js';
import { executeRequest } from './api.js';
import { createMap } from './map.js';
import './styles.css'

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
const clientId = import.meta.env.VITE_CLIENT_ID;

let auth0Client, accessToken;

async function initAuth() {
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
  const appEl = document.getElementById('app');

  if (isAuthenticated) {
    appEl.classList.add('isAuthenticated');
    const userProfile = await auth0Client.getUser();
    accessToken = await auth0Client.getTokenSilently();

    const profileEl = document.getElementById('profile');
    profileEl.innerHTML = `
            <p>${userProfile.name}</p>
            <img src='${userProfile.picture}' />
          `;
    
    const accessTokenEl = document.getElementById('accessToken');
    accessTokenEl.innerHTML = `${accessToken.substring(0, 10)}...`;
  } else {
    appEl.classList.remove('isAuthenticated');
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
const copyToClipboardButton = document.getElementById('copyToClipboardButton');
const copyToClipboardWrapper = document.getElementById('copyToClipboard');
function showSuccessText(element) {
  element.classList.add('isSuccess');
  setTimeout(function () {
    element.classList.remove('isSuccess');
  }, 1500);
}
copyToClipboardButton.addEventListener('click', (e) => {
  e.preventDefault();
  navigator.clipboard.writeText(accessToken);
  showSuccessText(copyToClipboardWrapper);
});

// Request API using the token
const requestAPIButton = document.getElementById('requestAPI');
const alertEl = document.getElementById('alertContainer');
requestAPIButton.addEventListener('click', (e) => {
  e.preventDefault();
  executeRequest(accessToken).then(
      setTimeout(function () {
        alertEl.classList.add('isVisible');
      }, 1000)
    )
});

// Close request API alert
const alertButtonEl = document.getElementById('alertClose');
alertButtonEl.addEventListener('click', (e) => {
  alertEl.classList.remove('isVisible');
});

// Create Map with deck.gl using the token
const createMapButton = document.getElementById('createMap');
createMapButton.addEventListener('click', (e) => {
  e.preventDefault();
  createMap(accessToken);
  createMapButton.classList.add("button--disabled");
});

initAuth()