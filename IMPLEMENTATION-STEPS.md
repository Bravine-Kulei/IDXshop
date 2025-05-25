# G20 Shop Codebase Reorganization Implementation Steps

This document outlines the specific steps to reorganize the G20 Shop codebase according to the plan in `REORGANIZATION-PLAN.md`.

## Step 1: Consolidate Backend Code

1. **Choose the primary backend directory**
   - Keep the `backend` directory as the primary backend directory
   - Move any unique files from `backendd` to `backend`
   - Delete the `backendd` directory after migration

2. **Standardize on JavaScript**
   - Keep JavaScript files in the backend
   - Convert any TypeScript files to JavaScript or keep them for future migration
   - Ensure consistent file extensions (.js)

3. **Organize backend structure**
   - Ensure all files are in the correct directories according to the structure in `PROJECT-STRUCTURE.md`
   - Move files to their appropriate locations if needed

## Step 2: Organize Frontend Code

1. **Move frontend files to the frontend directory**
   - Move all frontend files from `src` to `frontend/src`
   - Update import paths in all files

2. **Standardize on TypeScript**
   - Keep TypeScript files in the frontend
   - Convert key JavaScript files to TypeScript
   - Ensure consistent file extensions (.tsx for components, .ts for other files)

3. **Organize frontend structure**
   - Move components to appropriate directories
   - Organize contexts, hooks, and services
   - Ensure consistent naming conventions

## Step 3: Update Configuration Files

1. **Update package.json**
   - Create separate package.json files for frontend and backend
   - Update scripts and dependencies

2. **Update build configuration**
   - Update vite.config.ts for the frontend
   - Update any other build configuration files

3. **Update environment files**
   - Create .env.example files for frontend and backend
   - Document required environment variables

## Step 4: Update Import Paths

1. **Frontend import paths**
   - Update all import paths in frontend files to reflect the new structure
   - Use absolute imports where appropriate

2. **Backend import paths**
   - Update all import paths in backend files to reflect the new structure
   - Use consistent import patterns

## Step 5: Test the Application

1. **Test frontend**
   - Ensure the frontend builds successfully
   - Test all frontend functionality

2. **Test backend**
   - Ensure the backend starts successfully
   - Test all API endpoints

3. **Test integration**
   - Test the integration between frontend and backend
   - Ensure all features work as expected

## Step 6: Add Documentation

1. **Add README files**
   - Add README files to key directories
   - Update the main README.md file

2. **Add code comments**
   - Add comments to complex code sections
   - Document key functions and components

3. **Create API documentation**
   - Document all API endpoints
   - Include request and response formats

## Step 7: Clean Up

1. **Remove unused files**
   - Delete any unused or redundant files
   - Clean up temporary files

2. **Format code**
   - Ensure consistent code formatting
   - Apply ESLint and Prettier rules

3. **Update .gitignore**
   - Update .gitignore to exclude appropriate files
   - Ensure no sensitive information is committed

## Detailed File Migration Plan

### Backend Files to Organize

1. Move all files from `backend/src` to their appropriate locations according to the structure
2. Ensure all models are in `backend/src/db/models`
3. Ensure all controllers are in `backend/src/api/controllers`
4. Ensure all routes are in `backend/src/api/routes`
5. Ensure all services are in `backend/src/services`
6. Ensure all utilities are in `backend/src/utils`

### Frontend Files to Organize

1. Move all files from `src` to `frontend/src`
2. Move components to `frontend/src/components`
3. Move contexts to `frontend/src/contexts`
4. Move pages to `frontend/src/pages`
5. Move services to `frontend/src/services`
6. Move assets to `frontend/src/assets`
7. Update App.tsx and index.tsx

## Command Reference

Here are some useful commands for the reorganization:

```bash
# Create directories
mkdir -p frontend/src/{components,contexts,hooks,pages,services,types,utils}

# Move files
mv src/components/* frontend/src/components/
mv src/contexts/* frontend/src/contexts/
mv src/pages/* frontend/src/pages/
mv src/services/* frontend/src/services/
mv src/assets/* frontend/src/assets/

# Update import paths
find frontend/src -type f -name "*.tsx" -exec sed -i 's/from "\.\.\/components/from "..\/..\/components/g' {} \;

# Remove unused directories
rm -rf backendd
```

## Timeline

- **Day 1**: Complete Steps 1-3
- **Day 2**: Complete Steps 4-5
- **Day 3**: Complete Steps 6-7
