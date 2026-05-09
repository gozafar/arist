export const envs = {
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  appName: process.env.APP_NAME,

  email: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? '587'),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },

  whatsapp: {
    phoneNumber: process.env._WHATSAPP_PHONE_NUMBER!,
    message: process.env.WHATSAPP_MESSAGE || 'Hello! I need some assistance.',
  },
};
