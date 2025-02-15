export default () => ({
  app: {
    name: process.env.APPNAME,
    mode: process.env.MODE,
    port: process.env.APP_PORT,
    host: process.env.APP_HOST,
  },
  postgres: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    provider: process.env.DB_PROVIDER,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrations: process.env.RUN_MIGRATIONS,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    database: process.env.REDIS_DATABASE,
  },
  encryption: {
    scryptKey: process.env.SCRYPT_PASSWORD,
    scryptIv: process.env.SCRYPT_IV,
  },
  auth: {
    jwtKey: process.env.AUTH_JWT_TOKEN_SECRET,
    jwtExpiry: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshKey: process.env.AUTH_REFRESH_SECRET,
    refreshExpiry: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotKey: process.env.AUTH_FORGOT_SECRET,
    forgotExpiry: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmKey: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmExpiry: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
    googleClientId: process.env.AUTH_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  },
  mailer: {
    service: process.env.MAILER_SERVICE,
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE,
    auth: {
      user: process.env.MAILER_AUTH_USER,
      pass: process.env.MAILER_AUTH_PASSWORD,
    },
  },
  nats: {
    uri: process.env.NATS_URI,
    host: process.env.NATS_HOST,
    port: process.env.NATS_PORT,
    username: process.env.NATS_USERNAME,
    password: process.env.NATS_PASSWORD,
  },
  company: {
    name: process.env.COMPANY_NAME,
    email: process.env.COMPANY_EMAIL,
  },
});
