import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "dev-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh";
const ACCESS_TTL_SECONDS = Number(process.env.ACCESS_TOKEN_TTL || 60*7); // 1mint
const REFRESH_TTL_SECONDS = Number(process.env.REFRESH_TOKEN_TTL || 60 * 60 * 24 * 7); // 7 days

export type JwtRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export type JwtPayload = {
  userId: string;
  role: JwtRole;
};

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL_SECONDS });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL_SECONDS });

export const verifyAccessToken = (token: string): JwtPayload & jwt.JwtPayload => {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload & jwt.JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload & jwt.JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload & jwt.JwtPayload;
};


// import jwt from "jsonwebtoken";

// // Validate that required environment variables are set
// const validateJwtSecrets = () => {
//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT_SECRET environment variable is required");
//   }
//   if (!process.env.JWT_REFRESH_SECRET) {
//     throw new Error("JWT_REFRESH_SECRET environment variable is required");
//   }
// };

// // Initialize and validate secrets
// validateJwtSecrets();

// const ACCESS_SECRET = process.env.JWT_SECRET!;
// const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
// const ACCESS_TTL_SECONDS = Number(process.env.ACCESS_TOKEN_TTL || 30); // 30 seconds
// const REFRESH_TTL_SECONDS = Number(process.env.REFRESH_TOKEN_TTL || 60 * 60 * 24 * 7); // 7 days

// export type JwtRole = "USER" | "ADMIN" | "SUPER_ADMIN";

// export type JwtPayload = {
//   userId: string;
//   role: JwtRole;
// };

// export const signAccessToken = (payload: JwtPayload) =>
//   jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL_SECONDS });

// export const signRefreshToken = (payload: JwtPayload) =>
//   jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL_SECONDS });

// export const verifyAccessToken = (token: string): JwtPayload & jwt.JwtPayload => {
//   return jwt.verify(token, ACCESS_SECRET) as JwtPayload & jwt.JwtPayload;
// };

// export const verifyRefreshToken = (token: string): JwtPayload & jwt.JwtPayload => {
//   return jwt.verify(token, REFRESH_SECRET) as JwtPayload & jwt.JwtPayload;
// };