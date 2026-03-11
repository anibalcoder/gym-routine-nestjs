export const EnvConfiguration = () => ({
  dbHost: process.env.DB_HOST ?? 'localhost',
  dbPort: Number(process.env.DB_PORT ?? '5432'),
  dbUser: process.env.DB_USER ?? 'postgres',
  dbPassword: process.env.DB_PASSWORD ?? '',
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  apiBaseUrl: process.env.API_BASE_URL,
});
