import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(cors())

export interface LoginRequestBody {
  username: string
  password: string
}

export interface LoginResponseBody {
  token: string
  city: string
  isAdmin: boolean
}

// This endpoint simulate a login system. It checks the credentials and returns a valid token
// to query the tables for the city of the user. In addition, in case the user is an admin,
// the token will be created with permission for a sociodemographic tileset.
app.post('/login', async (req: Request, res: Response) => {
  const login = req.body as LoginRequestBody
  if (notCheckCredentials(login)) {
    res.status(401).send({ 'error': 'Invalid credentials' })
    return
  }

  const { city, isAdmin } = getPartsFromUsername(login.username)
  
  try {
    const token = await getTokenForCity(city, isAdmin)
    const response = { token, city, isAdmin } as LoginResponseBody
    res.send(response)
  } catch (error) {
    console.log(error)
    res.status(401).send({ 'error': 'Invalid credentials' })
  }

})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

function getPartsFromUsername(username: string) {
  const userPart = username.toLowerCase().split('@')[0]
  const city = userPart.split('.')[1].replace('-', ' ').toUpperCase() // new-york -> NEW YORK
  const isAdmin = userPart.split('.')[2] === 'admin'

  return { city, isAdmin }
}

function notCheckCredentials(login: LoginRequestBody): boolean {
  // username has the format 'user.city@domain.com' or 'user.city.admin@domain.com' 
  // and password should be like 'user1234'
  const usernameRegexp = /^[a-z]+\.[a-z]+[\W]?[a-z]*(\.admin)?@[a-z]+\.[a-z]+$/
  if (!usernameRegexp.test(login.username)) {
    return true
  }
  const user = login.username.split('.')[0]
  return login.password !== `${user}1234`
}

async function getTokenForCity(city: string, isAdmin: boolean): Promise<string> {
  const cartoBaseUrl = process.env.CARTO_BASE_URL
  const clientId = process.env.CARTO_CLIENT_ID
  const clientSecret = process.env.CARTO_CLIENT_SECRET

  // First get the access token by using the clientId and clientSecret.
  // NOTE: This token has a limit based on quota. For a production environment,
  // you should implement a cache mechanism to reuse the token.
  const accessTokenResponse = await fetch('https://auth.carto.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&audience=carto-cloud-native-api`
  })

  const { access_token, error } = await accessTokenResponse.json()
  if (error) {
    console.log(error)
    throw new Error(error)
  }

  // Generate the grants only for the specific permissions
  const grants = [
    {
      'connection_name': 'carto_dw',
      'source': `SELECT * FROM \`carto-demo-data\`.demo_tables.retail_stores WHERE city = '${city}'`
    }
  ]
  if (isAdmin) {
    grants.push({
      'connection_name': 'carto_dw',
      'source': 'carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup'
    })
  }

  // Finally, get the access API token by using the previous access token.
  // NOTE: This token has a limit based on quota. For a production environment,
  // you should implement a cache mechanism to reuse the token.
  const accessApiTokenResponse = await fetch(`${cartoBaseUrl}/v3/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
      'grants': grants,
      'referers': [],
      'allowed_apis': [
        'sql',
        'maps'
      ]
    })
  })

  const { token, error: tokenError, description: tokenDescription } = await accessApiTokenResponse.json()
  if (tokenError) {
    console.log(error)
    throw new Error(tokenError)
  }

  return token
}
