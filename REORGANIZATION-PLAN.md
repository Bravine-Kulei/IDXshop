# G20 Shop Codebase Reorganization Plan

This document outlines the steps to reorganize the G20 Shop codebase for better maintainability, readability, and professional structure.

## Current Issues

1. Duplicate backend directories (`backend` and `backendd`)
2. Mixed JavaScript and TypeScript files
3. Duplicate files in both frontend and backend (e.g., models)
4. Inconsistent file structure and naming conventions
5. Lack of clear documentation
6. Redundant files (App.jsx and App.tsx)

## Reorganization Steps

### 1. Create Proper Directory Structure

```
g20shop/
├── frontend/                     # Frontend React application
│   ├── public/                   # Static files
│   ├── src/                      # Source code
│   │   ├── assets/               # Images, fonts, etc.
│   │   ├── components/           # Reusable UI components
│   │   ├── contexts/             # React context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service functions
│   │   ├── types/                # TypeScript type definitions
│   │   ├── utils/                # Utility functions
│   │   ├── App.tsx               # Main App component
│   │   └── index.tsx             # Entry point
│   ├── package.json              # Frontend dependencies
│   └── ...
│
├── backend/                      # Backend Node.js application
│   ├── src/                      # Source code
│   │   ├── api/                  # API routes and controllers
│   │   ├── config/               # Configuration files
│   │   ├── db/                   # Database related files
│   │   ├── services/             # Business logic services
│   │   ├── utils/                # Utility functions
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # Server entry point
│   ├── tests/                    # Test files
│   ├── package.json              # Backend dependencies
│   └── ...
│
├── docs/                         # Project documentation
├── .gitignore                    # Git ignore file
├── README.md                     # Project README
└── ...
```

### 2. Consolidate Backend Code

1. Choose between JavaScript and TypeScript for backend
   - Standardize on JavaScript for backend for now
   - Plan for TypeScript migration in the future

2. Merge `backend` and `backendd` directories
   - Keep the most up-to-date files
   - Ensure all necessary functionality is preserved

3. Organize backend structure
   - Follow the structure in the project structure document
   - Ensure consistent naming conventions

### 3. Organize Frontend Code

1. Choose between JavaScript and TypeScript for frontend
   - Standardize on TypeScript for frontend
   - Convert remaining JavaScript files to TypeScript

2. Clean up duplicate files
   - Decide between App.jsx and App.tsx
   - Remove redundant files

3. Organize frontend structure
   - Move components to appropriate directories
   - Ensure consistent naming conventions

### 4. Standardize Naming Conventions

1. Files and Directories
   - Use **PascalCase** for React components
   - Use **camelCase** for utility files and non-component files
   - Use **kebab-case** for configuration files
   - Use **snake_case** for database-related files

2. Components
   - Component files should be named after their function
   - Higher-order components should be prefixed with "with"
   - Context providers should be suffixed with "Provider" or "Context"

### 5. Add Documentation

1. Create README files for key directories
2. Add code comments where necessary
3. Create API documentation

### 6. Implementation Plan

1. Create the new directory structure
2. Move and reorganize backend files
3. Move and reorganize frontend files
4. Update import paths in all files
5. Test the application to ensure functionality is preserved
6. Add documentation

## Timeline

1. **Day 1**: Create directory structure and move files
2. **Day 2**: Update import paths and fix any issues
3. **Day 3**: Add documentation and test the application

## Risks and Mitigations

1. **Risk**: Breaking functionality during reorganization
   **Mitigation**: Test thoroughly after each step

2. **Risk**: Missing dependencies or files
   **Mitigation**: Keep a backup of the original codebase

3. **Risk**: Inconsistent naming conventions
   **Mitigation**: Use automated tools to enforce naming conventions
