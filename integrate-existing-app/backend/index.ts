import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000
const jwtSecret = process.env.JWT_SECRET as string

app.use(express.json())
app.use(cors())

interface LoginRequestBody {
  username: string
  password: string
}

interface LoginResponseBody {
  token: string
}

interface AccessApiTokenResponse {
  token: string
  group: string
  error: string
  description: string
}

// Hard-coded users for development purposes.
// Don't use this in production! This should come from an IdP or a database.
const users = [{
    username: 'user.boston@acme.com',
    password: 'boston',
    group: 'BOSTON'
  },
  {
    username: 'user.ny@acme.com',
    password: 'ny',
    group: 'NEW YORK'
  } 
]

// This endpoint simulates a login system. It checks the credentials and returns a JWT token
// with the user group as a claim.
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body as LoginRequestBody
  const user = users.find((u) => u.username === username)

  if (!user || user.password !== password) {
    res.status(401).send({ 'error': 'Invalid credentials' })
    return
  }

  const loginToken = jwt.sign({ group: user.group }, jwtSecret, { expiresIn: '1h' })
  const loginResponse = { token: loginToken } as LoginResponseBody
  res.send(loginResponse)
})

// This endpoint returns a CARTO API Access Token for the user group. The token will be used
// to query the tables for the city of the user.
app.post('/carto-token', async (req: Request, res: Response) => {
  try {

    // Get the token from the Authorization header with Bearer prefix
    const authHeader = req.headers.authorization as string
    const loginToken = authHeader.replace('Bearer ', '')

    // Decode the token to get the group
    const tokenGroup = jwt.verify(loginToken, jwtSecret) as { group: string }
    const token = await getAPIAccessTokenForGroup(tokenGroup.group)
    const response = { token, group: tokenGroup.group } as AccessApiTokenResponse
    res.send(response)
  } catch (error) {
    console.log(error)
    res.status(401).send({ 'error': 'Invalid token' })
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

async function getAPIAccessTokenForGroup(group: string): Promise<string> {
  const cartoBaseUrl = process.env.CARTO_API_BASE_URL
  const clientId = process.env.CARTO_CLIENT_ID
  const clientSecret = process.env.CARTO_CLIENT_SECRET

  // Step 1: Get an OAuth Access Token using the clientId and clientSecret of a M2M OAuth Client.
  const accessTokenResponse = await fetch('https://auth.carto.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&audience=carto-cloud-native-api`
  })

  const { access_token, error } = await accessTokenResponse.json() as { access_token: string, error: string }
  if (error) {
    console.log(error)
    throw new Error(error)
  }

  // Step 2: Generate an API Access Token for the logged user (with limited grants).
  const grants = [
    {
      'connection_name': 'carto_dw',
      'source': `SELECT * FROM \`carto-demo-data\`.demo_tables.retail_stores WHERE city = @groupcity`
    }
  ]

  // Call the tokens API using the OAuth Access Token from step 1.
  const accessApiTokenResponse = await fetch(`${cartoBaseUrl}/v3/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
      'grants': grants,
      // Put here the referers of your frontend application in production
      'referers': [],
      'allowed_apis': [
        // 'sql', // Uncomment this line to allow SQL API calls
        'maps'
      ]
    })
  })

  const { token, error: tokenError, description: tokenDescription } = await accessApiTokenResponse.json() as { token: string, error: string, description: string }
  if (tokenError) {
    console.log(error)
    throw new Error(tokenError)
  }

  return token
}
