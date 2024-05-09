import './style.css'
import { initAuth } from './auth'
import { createMap } from './map'
import { getAirports } from './api'
import logo from '../static/carto-logo.svg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div id="loggedOutContainer" class="login">
        <img
          src=${logo}
          loading="lazy"
          height="48"
          alt="CARTO"
          class="login__logo"
        />
        <button id="login" class="button login__button">Login</button>
      </div>

      <div id="loggedContainer" class="logged-in">
        <header class="header">
          <img
            src=${logo}
            loading="lazy"
            height="32"
            alt="CARTO"
          />
          <div class="header__info">
            <div id="profile" class="profile"></div>
            <button id="logout" class="button">Logout</button>
          </div>
        </header>

        <div class="content">
          <div id="map"></div>
          <canvas id="deck-canvas"></canvas>
        </div>
      </div>
`

initAuth().then((accessToken) => {
  if (accessToken) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    createMap({apiBaseUrl, accessToken});
    getAirports({apiBaseUrl, accessToken}).then((airports) => {
      console.log(airports)
    })
  }
})
