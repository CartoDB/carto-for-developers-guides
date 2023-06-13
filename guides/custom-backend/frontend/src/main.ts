import './style.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import { createMap, initMap } from './map'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <section class="layout">
    <div class="header">
      <div class="login-container"></div>
    </div>
    <div class="main">
      <div id="map"></div>
      <canvas id="deck-canvas"></canvas>
    </div>
  </section>
`

// init login form and empty map
initLogin()

function addLoginForm() {
  document.querySelector<HTMLDivElement>('.login-container')!.innerHTML = `
    <div>
      <input type="text" placeholder="Username" name="username">
      <input type="password" placeholder="Password" name="password">
      <button type="submit" id="login">Login</button>
    </div>
  `
  document.getElementById("login")?.addEventListener("click", login);
}

async function login() {
  const username = (document.querySelector('input[name="username"]') as HTMLInputElement).value
  const password = (document.querySelector('input[name="password"]') as HTMLInputElement).value
  const loginResp = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  const {token, city, isAdmin, error} = await loginResp.json()

  if (error) {
    alert(error)
    return
  }

  document.querySelector<HTMLDivElement>('.login-container')!.innerHTML = `
    <div>
      ${username} - <strong>${city}</strong>
      <button type="submit" id="logout">Logout</button>
    </div>
  `
  document.getElementById("logout")?.addEventListener("click", initLogin);

  createMap(city, token, isAdmin)
}

function initLogin() {
  addLoginForm()
  initMap()
}