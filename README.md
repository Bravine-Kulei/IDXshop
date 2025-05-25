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
```bash
cd backend
npm test
```

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
