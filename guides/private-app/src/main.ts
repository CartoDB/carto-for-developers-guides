import './style.css'
import { initAuth } from './auth'
import { createMap } from './map'
import { setDefaultCredentials }from '@deck.gl/carto/typed'
import { getAirports } from './api'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <button id="login">Login</button>
  <div id="login-content">
    <header>
      <button id="logout">Logout</button>
      <div id="profile"></div>
    </header>
    <div id="map"></div>
    <canvas id="deck-canvas"></canvas>
  </div>
`

initAuth().then((accessToken) => {
  if (accessToken) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    setDefaultCredentials({ apiBaseUrl, accessToken})
    createMap()
    getAirports({apiBaseUrl, accessToken}).then((airports) => {
      console.log(airports)
    })
  }
})
