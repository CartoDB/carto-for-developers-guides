import { initAuth } from './auth'
import { createMap } from './map'
import { setDefaultCredentials }from '@deck.gl/carto/typed'
import { getAirports } from './api'

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
