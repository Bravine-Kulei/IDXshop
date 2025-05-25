# TechGear Shop Backend Setup Guide

This guide will help you set up the backend system for your laptop and PC accessories shop with repair and maintenance services.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Step 1: Project Setup

1. Create a new directory for your project:

```bash
mkdir techgear-backend
cd techgear-backend
```

2. Initialize a new Node.js project:

```bash
npm init -y
```

3. Install core dependencies:

```bash
npm install express sequelize pg pg-hstore dotenv bcrypt jsonwebtoken cors helmet morgan winston express-validator multer
```

4. Install development dependencies:

```bash
npm install --save-dev nodemon eslint prettier jest supertest sequelize-cli
```

## Step 2: Project Structure

Create the folder structure as outlined in the backend-structure.md file:

```bash
mkdir -p src/{config,api/{routes,controllers,middlewares,validators},db/{models,migrations,seeders,repositories},services,utils,jobs}
mkdir -p tests/{unit/{services,controllers},integration/{api,db},fixtures}
mkdir -p scripts docs/{api,database}
```

## Step 3: Configuration Files

1. Create a `.env` file in the root directory:

```
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=techgear
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=TechGear <noreply@techgear.com>
```

2. Create a database configuration file at `src/config/database.js`:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
```

## Step 4: Create Base Files

1. Create the main application file at `src/app.js`:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./api/routes');
const errorMiddleware = require('./api/middlewares/error.middleware');
const logger = require('./utils/logger');

// Initialize express app
const app = express();

// Apply middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
```

2. Create the server entry point at `src/server.js`:

```javascript
const app = require('./app');
const sequelize = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

// Test database connection
async function assertDatabaseConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await assertDatabaseConnection();
  
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

startServer();
```

3. Create a logger utility at `src/utils/logger.js`:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'techgear-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
```

4. Create custom error classes at `src/utils/errors.js`:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 403);
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database error occurred') {
    super(message, 500);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  DatabaseError
};
```

5. Create an error handling middleware at `src/api/middlewares/error.middleware.js`:

```javascript
const logger = require('../../utils/logger');
const { AppError } = require('../../utils/errors');

module.exports = (err, req, res, next) => {
  // Log the error
  logger.error(err);
  
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = [];
  
  // Handle known errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  
  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }
  
  // Handle express-validator errors
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.array();
  }
  
  // Send response
  res.status(statusCode).json({
    status: 'error',
    message,
    errors: errors.length ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
```

## Step 5: Database Setup

1. Create a `.sequelizerc` file in the root directory:

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src/config', 'database.js'),
  'models-path': path.resolve('src/db', 'models'),
  'seeders-path': path.resolve('src/db', 'seeders'),
  'migrations-path': path.resolve('src/db', 'migrations')
};
```

2. Create a database setup script at `scripts/db-setup.js`:

```javascript
const { exec } = require('child_process');
const sequelize = require('../src/config/database');
const logger = require('../src/utils/logger');

async function setupDatabase() {
  try {
    // Create database if it doesn't exist
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    logger.info('Database created or already exists');
    
    // Run migrations
    exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
      if (error) {
        logger.error(`Migration error: ${error.message}`);
        return;
      }
      if (stderr) {
        logger.error(`Migration stderr: ${stderr}`);
        return;
      }
      logger.info(`Migration stdout: ${stdout}`);
      
      // Run seeders
      exec('npx sequelize-cli db:seed:all', (error, stdout, stderr) => {
        if (error) {
          logger.error(`Seeder error: ${error.message}`);
          return;
        }
        if (stderr) {
          logger.error(`Seeder stderr: ${stderr}`);
          return;
        }
        logger.info(`Seeder stdout: ${stdout}`);
        logger.info('Database setup completed successfully');
      });
    });
  } catch (error) {
    logger.error('Database setup failed:', error);
  }
}

setupDatabase();
```

## Step 6: Update package.json Scripts

Add the following scripts to your `package.json`:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "lint": "eslint .",
  "format": "prettier --write .",
  "test": "jest",
  "test:watch": "jest --watch",
  "db:setup": "node scripts/db-setup.js",
  "db:migrate": "sequelize-cli db:migrate",
  "db:seed": "sequelize-cli db:seed:all"
}
```

## Step 7: Running the Application

1. Set up the database:

```bash
npm run db:setup
```

2. Start the development server:

```bash
npm run dev
```

## Next Steps

1. Implement the models as shown in the sample implementation
2. Create the controllers, services, and routes
3. Implement authentication and authorization
4. Add validation for all API endpoints
5. Write tests for your implementation
6. Set up CI/CD for automated testing and deployment

## Additional Considerations

### Docker Setup

For easier development and deployment, consider using Docker:

1. Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

2. Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=techgear
      - DB_USER=postgres
      - DB_PASSWORD=postgres
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:13-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=techgear
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. Run with Docker Compose:

```bash
docker-compose up
```

### API Documentation

Consider using Swagger/OpenAPI for API documentation:

1. Install Swagger UI Express:

```bash
npm install swagger-ui-express swagger-jsdoc
```

2. Create a Swagger configuration in your app.js:

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechGear Shop API',
      version: '1.0.0',
      description: 'API for TechGear Shop with inventory and repair tracking'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/api/routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
```
