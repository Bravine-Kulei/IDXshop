# G20 Shop - Laptop & PC Accessories E-commerce

A full-stack e-commerce application for laptop and PC accessories with repair and maintenance services.

## Project Overview

G20 Shop is a modern e-commerce platform built with:
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL

## Features

- Product browsing with categories and search
- Product detail pages with quick view functionality
- Shopping cart and wishlist management
- User authentication and profile management
- Responsive design for mobile and desktop
- Recently viewed products tracking
- Laptop repair and maintenance services
- Trust badges and customer assurance elements

## Project Structure

The project is organized into two main parts:
- **Frontend**: React application with TypeScript
- **Backend**: Node.js API with Express and Sequelize ORM

For detailed information about the project structure, see [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md).

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (for backend)

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=g20shop
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

This will create a `dist` folder with the compiled assets.

### Backend

```bash
cd backend
npm run build
```

## Deployment

### Frontend Deployment (Netlify)

1. Push your code to a GitHub repository
2. Log in to Netlify and click "New site from Git"
3. Select your repository
4. Set build command to `cd frontend && npm run build`
5. Set publish directory to `frontend/dist`
6. Set environment variables in Netlify dashboard
7. Click "Deploy site"

### Backend Deployment

The backend can be deployed to various platforms like Heroku, AWS, or DigitalOcean.

#### Environment Variables

Make sure to set the following environment variables in your deployment platform:

- Frontend: `VITE_API_URL`: URL of your backend API
- Backend: All the variables from the backend `.env` file

## Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
npm test
```

## Troubleshooting

If you encounter issues during development or deployment:

1. Check that your API URL is correctly set in the environment variables
2. Ensure your backend CORS settings allow requests from your frontend domain
3. Verify that the database connection is properly configured
4. Check the console for error messages

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
