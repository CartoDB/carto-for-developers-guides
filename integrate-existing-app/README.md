#  Integrate CARTO in your existing app

Sample Application to showcase how to build a private app in CARTO (using a login with email and password). It uses Vanilla Javascript, [Express](https://expressjs.com/) and [Vite](https://vitejs.dev/guide/).

For more info visit the [Integrate CARTO in your existing app](https://docs.carto.com/carto-for-developers/overview) guide. 

### Start instructions

Create a new M2M OAuth Client from https://app.carto.com (Developers -> Credentials -> New M2M OAuth Client).

Set the Base API URL, Client ID and Client Secret at `backend/.env`.
Set the Base API URL at `frontend/.env`.

1. Run the backend:

```bash
cd backend
npm install
npm run dev
```

2. Run the frontend:

```bash
cd frontend
npm install
npm run dev
```