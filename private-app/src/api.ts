// Execute request to CARTO SQL API
interface ExecuteQueryProps {
  apiBaseUrl: string
  connection: string
  query: string
  accessToken: string
}
async function executeQuery ({apiBaseUrl, connection, query, accessToken}: ExecuteQueryProps) {
  const url = `${apiBaseUrl}/v3/sql/${connection}/query?q=${encodeURI(query)}`
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };
  const response = await fetch(url, options);
  return await response.json();
}

interface GetAirportsProps {
  apiBaseUrl: string,
  accessToken: string
}
export function getAirports ({apiBaseUrl, accessToken}: GetAirportsProps) {
  const query = `select * from carto-demo-data.demo_tables.airports`
  const connection = 'carto_dw'
  return executeQuery({apiBaseUrl, connection, query, accessToken})
}
