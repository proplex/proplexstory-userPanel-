import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// app/api/auth/route.js
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('fandora_auth_token')
  
  const origin = 'http://localhost:3000'
  
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Auth token not found' }), 
      {
        status: 401,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': origin,
          'Content-Type': 'application/json',
        }
      }
    )
  }
  
  return new NextResponse(
    JSON.stringify({ token: token.value }), 
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': origin,
        'Content-Type': 'application/json',
      }
    }
  )
}
