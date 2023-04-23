// Execute request to CARTO SQL API
export async function executeRequest (accessToken) {
  const sql = `select * from carto-demo-data.demo_tables.airports`
  // CARTO Data Warehouse connection
  const connection = 'carto_dw'
  const url = `https://gcp-us-east1.api.carto.com/v3/sql/${connection}/query?q=${sql}`
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
}