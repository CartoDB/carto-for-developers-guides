import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import jwt from 'jsonwebtoken'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000
const jwtSecret = process.env.CARTO_BASE_URL as string

app.use(express.json())
app.use(cors())

export interface LoginRequestBody {
  username: string
  password: string
}

export interface LoginResponseBody {
  token: string
}

export interface CartoTokenResponseBody {
  token: string
  city: string
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

  const group = getGroupFromUsername(login.username)
  const loginToken = jwt.sign({ group }, jwtSecret, { expiresIn: '1h' })
  const loginResponse = { token: loginToken } as LoginResponseBody
  res.send(loginResponse)
})

app.post('/carto-token', async (req: Request, res: Response) => {
  try {
    // Get the token from the Authorization header with Bearer prefix
    const authHeader = req.headers.authorization as string
    const loginToken = authHeader.replace('Bearer ', '')

    // Decode the token to get the group
    const jwtSecret = process.env.CARTO_BASE_URL as string
    const tokenGroup = jwt.verify(loginToken, jwtSecret) as { group: string }
    const token = await getTokenForGroup(tokenGroup.group)
    const response = { token, city: tokenGroup.group } as LoginResponseBody
    res.send(response)
  } catch (error) {
    console.log(error)
    res.status(401).send({ 'error': 'Invalid token' })
  }

})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

function getGroupFromUsername(username: string) {
  const userPart = username.toLowerCase().split('@')[0]
  const city = userPart.split('.')[1].replace('-', ' ').toUpperCase() // new-york -> NEW YORK

  return city
}

function notCheckCredentials(login: LoginRequestBody): boolean {
  // username has the format 'user.city@domain.com'
  // and password should be like 'user1234'
  const usernameRegexp = /^[a-z]+\.[a-z]+[\W]?[a-z]*@[a-z]+\.[a-z]+$/
  if (!usernameRegexp.test(login.username)) {
    return true
  }
  const user = login.username.split('.')[0]
  return login.password !== `${user}1234`
}

async function getTokenForGroup(city: string): Promise<string> {
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
