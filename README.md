<<<<<<< HEAD
# G20 Shop - E-commerce Platform

A full-stack e-commerce platform for laptop and PC accessories with integrated repair and maintenance services.

## 🚀 Features

- **Product Management**: Browse laptops, PC accessories, and components
- **Service Booking**: Schedule laptop repair and maintenance services
- **User Authentication**: Role-based access with Clerk integration
- **Shopping Cart**: Add/remove items and manage quantities
- **Order Management**: Track orders and purchase history
- **Admin Dashboard**: Inventory management and order processing
- **Responsive Design**: Mobile-optimized interface
- **Search & Filtering**: Advanced product search capabilities

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with Sequelize ORM
- **Clerk** for authentication and user management
- **Stripe** for payment processing
- **Winston** for logging
- **Jest** for testing

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Clerk React** for authentication
- **Axios** for API calls
- **Lucide React** for icons

## 📁 Project Structure

```
g20shop/
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── api/            # API routes
│   │   ├── models/         # Database models
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── services/       # Business logic
│   │   └── config/         # Configuration files
│   ├── tests/              # Test files
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── contexts/       # React contexts
│   └── package.json
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/g20shop.git
   cd g20shop
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/g20shop
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 🧪 Testing

### Backend Tests
=======
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

>>>>>>> frontend
```bash
cd backend
npm test
```

<<<<<<< HEAD
### API Testing
Use the provided Postman collection or test individual endpoints:
```bash
npm run test:api
```

## 📚 API Documentation

API endpoints are documented in `/docs/api/endpoints.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Brabin** - E-commerce Developer

## 🙏 Acknowledgments

- Clerk for authentication services
- Stripe for payment processing
- The open-source community for amazing tools and libraries
=======
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
>>>>>>> frontend
