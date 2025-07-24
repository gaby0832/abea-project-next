export async function POST(req: Request) {
  const data = await req.json()
  
  try{
  const response = await fetch('http://localhost:3000/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  return Response.json({ backend: result })

} catch(err) {
  console.log(err)
} 