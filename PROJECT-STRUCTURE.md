# G20 Shop Project Structure

This document outlines the recommended project structure for the G20 Shop e-commerce application.

## Overview

The project is organized into two main parts:
1. **Frontend** - React application with TypeScript
2. **Backend** - Node.js API with Express and Sequelize ORM

## Directory Structure

```
g20shop/
├── frontend/                     # Frontend React application
│   ├── public/                   # Static files
│   ├── src/                      # Source code
│   │   ├── assets/               # Images, fonts, etc.
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/           # Common components used across the app
│   │   │   ├── layout/           # Layout components (Header, Footer, etc.)
│   │   │   └── [feature]/        # Feature-specific components
│   │   ├── contexts/             # React context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service functions
│   │   ├── types/                # TypeScript type definitions
│   │   ├── utils/                # Utility functions
│   │   ├── App.tsx               # Main App component
│   │   ├── index.tsx             # Entry point
│   │   └── ...
│   ├── .env                      # Environment variables
│   ├── package.json              # Frontend dependencies
│   └── ...
│
├── backend/                      # Backend Node.js application
│   ├── src/                      # Source code
│   │   ├── api/                  # API routes and controllers
│   │   │   ├── controllers/      # Route controllers
│   │   │   ├── middlewares/      # Custom middlewares
│   │   │   ├── routes/           # Route definitions
│   │   │   └── validators/       # Request validators
│   │   ├── config/               # Configuration files
│   │   ├── db/                   # Database related files
│   │   │   ├── models/           # Database models
│   │   │   ├── migrations/       # Database migrations
│   │   │   ├── seeders/          # Database seeders
│   │   │   └── repositories/     # Data access layer
│   │   ├── services/             # Business logic services
│   │   ├── utils/                # Utility functions
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # Server entry point
│   ├── tests/                    # Test files
│   ├── .env                      # Environment variables
│   ├── package.json              # Backend dependencies
│   └── ...
│
├── docs/                         # Project documentation
│   ├── api/                      # API documentation
│   ├── frontend/                 # Frontend documentation
│   └── ...
│
├── .gitignore                    # Git ignore file
├── README.md                     # Project README
└── ...
```

## Naming Conventions

### Files and Directories

- Use **PascalCase** for React components: `ProductCard.tsx`, `Header.tsx`
- Use **camelCase** for utility files and non-component files: `authService.js`, `formatDate.js`
- Use **kebab-case** for configuration files: `vite-config.js`, `tailwind-config.js`
- Use **snake_case** for database-related files: `user_model.js`, `product_repository.js`

### Components

- Component files should be named after their function: `ProductCard.tsx`, `CheckoutForm.tsx`
- Higher-order components should be prefixed with "with": `withAuth.tsx`
- Context providers should be suffixed with "Provider" or "Context": `CartProvider.tsx`, `AuthContext.tsx`

## Import Order

For better readability, imports should be organized in the following order:

1. External libraries
2. Internal modules
3. Components
4. Styles

Example:
```javascript
// External libraries
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Internal modules
import { formatPrice } from '../utils/formatters';
import { useCart } from '../contexts/CartContext';

// Components
import ProductImage from './ProductImage';
import AddToCartButton from './AddToCartButton';

// Styles
import './ProductDetail.css';
```

## Code Style

- Use consistent indentation (2 spaces recommended)
- Add meaningful comments for complex logic
- Use TypeScript for type safety where possible
- Follow ESLint and Prettier configurations
