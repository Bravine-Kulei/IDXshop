# G20 Shop Codebase Organization Summary

This document provides a summary of the codebase organization for the G20 Shop e-commerce platform.

## Project Structure

The project is organized into two main parts:
1. **Frontend** - React application with TypeScript
2. **Backend** - Node.js API with Express and Sequelize ORM

```
g20shop/
├── frontend/                     # Frontend React application
├── backend/                      # Backend Node.js application
├── docs/                         # Project documentation
├── .gitignore                    # Git ignore file
├── README.md                     # Project README
└── ...
```

## Documentation

The following documentation files have been created to help understand and maintain the codebase:

1. **README.md** - Main project documentation
2. **PROJECT-STRUCTURE.md** - Detailed project structure
3. **REORGANIZATION-PLAN.md** - Plan for reorganizing the codebase
4. **IMPLEMENTATION-STEPS.md** - Specific steps to implement the reorganization
5. **docs/README.md** - Documentation overview
6. **docs/api/endpoints.md** - API endpoint documentation
7. **docs/frontend/components.md** - Frontend component documentation
8. **frontend/README.md** - Frontend-specific documentation
9. **backend/README.md** - Backend-specific documentation

## Naming Conventions

The following naming conventions are used throughout the codebase:

1. **Files and Directories**
   - **PascalCase** for React components: `ProductCard.tsx`, `Header.tsx`
   - **camelCase** for utility files and non-component files: `authService.js`, `formatDate.js`
   - **kebab-case** for configuration files: `vite-config.js`, `tailwind-config.js`
   - **snake_case** for database-related files: `user_model.js`, `product_repository.js`

2. **Components**
   - Component files should be named after their function: `ProductCard.tsx`, `CheckoutForm.tsx`
   - Higher-order components should be prefixed with "with": `withAuth.tsx`
   - Context providers should be suffixed with "Provider" or "Context": `CartProvider.tsx`, `AuthContext.tsx`

## Code Style

The following code style guidelines are used throughout the codebase:

1. **Indentation**: 2 spaces
2. **Semicolons**: Required
3. **Quotes**: Single quotes for JavaScript/TypeScript, double quotes for JSX
4. **Trailing Commas**: Required for multiline
5. **Line Length**: 80 characters
6. **Comments**: JSDoc style for functions and components

## Import Order

For better readability, imports should be organized in the following order:

1. External libraries
2. Internal modules
3. Components
4. Styles

## Next Steps

To implement the reorganization plan, follow the steps in `IMPLEMENTATION-STEPS.md`. The main tasks are:

1. Consolidate backend code
2. Organize frontend code
3. Update configuration files
4. Update import paths
5. Test the application
6. Add documentation
7. Clean up

## Benefits of Reorganization

The reorganization of the codebase will provide the following benefits:

1. **Improved Maintainability**: Clear separation of concerns and consistent structure
2. **Better Readability**: Consistent naming conventions and code style
3. **Easier Onboarding**: Comprehensive documentation for new developers
4. **Reduced Duplication**: Elimination of duplicate code and files
5. **Scalability**: Structure that can accommodate future growth
