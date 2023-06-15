import "./style.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { createMap, initMap } from "./map";
import logo from "../static/acme-logo.svg";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <header class="header">
      <img
        src=${logo}
        loading="lazy"
        height="32"
        alt="ACME"
      />
      <div class="header__info" id="login-container"></div>
    </header>

    <div class="content">
      <div id="map"></div>
      <canvas id="deck-canvas"></canvas>
    </div>
  </div>
`;

// init login form and empty map
initLogin();

function addLoginForm() {
  document.querySelector<HTMLDivElement>("#login-container")!.innerHTML = `
      <input type="text" placeholder="Username" name="username">
      <input type="password" placeholder="Password" name="password">
      <button type="submit" id="login" class="button button--primary">Login</button>
  `;
  document.getElementById("login")?.addEventListener("click", login);
}

async function login() {
  const username = (
    document.querySelector('input[name="username"]') as HTMLInputElement
  ).value;
  const password = (
    document.querySelector('input[name="password"]') as HTMLInputElement
  ).value;

  const loginResp = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const { token, error } = await loginResp.json();
  if (error) {
    alert(error);
    return;
  }
  const tokenResp = await fetch("http://localhost:8000/carto-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
  });

  const { token: cartoToken, city, error: tokenError } = await tokenResp.json();
  if (tokenError) {
    alert(tokenError);
    return;
  }

  document.querySelector<HTMLDivElement>("#login-container")!.innerHTML = `
    <div class="profile">
      ${username} - <span>${city}</span>
      <button type="submit" id="logout" class="button">Logout</button>
    </div>
  `;
  document.getElementById("logout")?.addEventListener("click", initLogin);

  createMap(city, cartoToken);
}

function initLogin() {
  addLoginForm();
  initMap();
}
