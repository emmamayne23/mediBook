import jwt from "jsonwebtoken"

export function getAuthFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!)
    return decoded as { sub: string; email: string; role: string }
  } catch {
    return null
  }
}
