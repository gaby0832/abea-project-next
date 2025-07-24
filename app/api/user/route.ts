export async function GET() { 
  try{
  const response = await fetch('http://localhost:3000/users/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
  })

  const result = await response.json()
  return Response.json({ backend: result })

} catch(err) {
  console.log(err)
} 