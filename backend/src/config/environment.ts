import dotenv from 'dotenv';

dotenv.config();

const environment = {
  app: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    domain: process.env.DOMAIN || 'http://localhost',
    company: {
      name: process.env.COMPANY_NAME || 'My Company',
      email: process.env.COMPANY_EMAIL || 'info@mycompany.com',
      phone: process.env.COMPANY_PHONE || '+1234567890',
      address: {
        street: process.env.COMPANY_STREET || '123 Main St',
        city: process.env.COMPANY_CITY || 'Anytown',
        state: process.env.COMPANY_STATE || 'ST',
        zip: process.env.COMPANY_ZIP || '12345',
        country: process.env.COMPANY_COUNTRY || 'USA'
      }
    }
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    defaultAdminUsername: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
    defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key',
    demoProjectSecret: process.env.DEMO_SECRET || 'your-projects-secret',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || 'user@example.com',
    password: process.env.EMAIL_PASSWORD || 'password',
    from: process.env.EMAIL_FROM || 'noreply@example.com'
  },
  docker: {
    socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock'
  },
  traefik: {
    configPath: process.env.TRAEFIK_CONFIG_PATH || '/...'
  }
};

export default environment;