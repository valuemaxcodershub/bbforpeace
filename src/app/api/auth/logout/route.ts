import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL('/admin/login', request.url)
  const response = NextResponse.redirect(url)

  // Delete Payload's auth cookie
  response.cookies.delete('payload-token')

  return response
}
