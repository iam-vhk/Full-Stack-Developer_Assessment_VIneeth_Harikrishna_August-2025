import dotenv from 'dotenv';
dotenv.config();
export const config = {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
