# Clerk React SDK Integration Test Plan

## Overview
This document outlines the testing plan for the Clerk React SDK integration in the TechGear e-commerce frontend.

## Implementation Summary

### ✅ **Completed Components:**

1. **Main Application Setup**
   - ✅ ClerkProvider configured in main.tsx
   - ✅ Environment variables setup (.env.example)
   - ✅ Axios interceptor for automatic token injection

2. **Authentication Components**
   - ✅ ProtectedRoute - Requires authentication
   - ✅ AdminRoute - Requires admin role
   - ✅ UserButton - Clerk user menu
   - ✅ SignInButton - Modal sign-in
   - ✅ SignUpButton - Modal sign-up

3. **Authentication Pages**
   - ✅ SignInPage - Full-page sign-in with custom styling
   - ✅ SignUpPage - Full-page sign-up with custom styling

4. **Admin Pages**
   - ✅ AdminDashboard - Overview with stats
   - ✅ AdminInventory - Product management
   - ✅ AdminUsers - User role management

5. **Layout Integration**
   - ✅ Header component updated with Clerk auth
   - ✅ Mobile menu with authentication
   - ✅ Role-based navigation (admin links)

6. **Routing System**
   - ✅ AppWithClerkRouting - Complete routing with auth
   - ✅ Protected routes for user dashboard
   - ✅ Admin routes with role checking
   - ✅ Public routes for landing pages

## Testing Checklist

### 1. **Environment Setup**
- [ ] Copy `.env.example` to `.env`
- [ ] Add real Clerk publishable key to `VITE_CLERK_PUBLISHABLE_KEY`
- [ ] Verify backend is running on port 3000

### 2. **Basic Authentication Flow**
- [ ] Visit homepage - should show Sign In/Sign Up buttons
- [ ] Click Sign In button - should open Clerk modal
- [ ] Click Sign Up button - should open Clerk modal
- [ ] Navigate to `/sign-in` - should show full-page sign-in
- [ ] Navigate to `/sign-up` - should show full-page sign-up

### 3. **Protected Routes**
- [ ] Try accessing `/dashboard` without auth - should redirect to sign-in
- [ ] Try accessing `/admin` without auth - should redirect to sign-in
- [ ] Sign in as regular user, try `/admin` - should show access denied

### 4. **User Authentication**
- [ ] Sign up new user - should redirect to dashboard
- [ ] Sign in existing user - should show user button in header
- [ ] User button should show user info and sign-out option
- [ ] Sign out should return to homepage

### 5. **Admin Authentication**
- [ ] Set user role to 'admin' in Clerk dashboard
- [ ] Sign in as admin - should see "Admin" link in navigation
- [ ] Access `/admin` - should show admin dashboard
- [ ] Access `/admin/inventory` - should show inventory management
- [ ] Access `/admin/users` - should show user management

### 6. **Mobile Responsiveness**
- [ ] Test mobile menu functionality
- [ ] Verify auth buttons work in mobile menu
- [ ] Check user button display on mobile

### 7. **API Integration**
- [ ] Verify axios interceptor adds Bearer token
- [ ] Test admin API calls with Clerk token
- [ ] Check error handling for expired tokens

## Configuration Requirements

### 1. **Clerk Dashboard Setup**
```
1. Create Clerk application
2. Get publishable key and secret key
3. Configure allowed redirect URLs:
   - http://localhost:5173
   - http://localhost:5173/dashboard
   - http://localhost:5173/admin
4. Set up user metadata for roles:
   - publicMetadata.role = "admin" | "customer"
```

### 2. **Environment Variables**
```env
# Frontend (.env)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_API_URL=http://localhost:3000/api

# Backend (.env)
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. **User Role Management**
```javascript
// In Clerk dashboard, set user metadata:
{
  "publicMetadata": {
    "role": "admin" // or "customer"
  }
}
```

## Expected Behavior

### **Anonymous Users:**
- Can browse homepage and public pages
- See Sign In/Sign Up buttons in header
- Cannot access protected routes
- Redirected to sign-in when accessing protected content

### **Authenticated Customers:**
- See user button instead of auth buttons
- Can access user dashboard
- Cannot access admin routes
- Can sign out from user button menu

### **Authenticated Admins:**
- See user button and "Admin" navigation link
- Can access all user routes
- Can access admin dashboard and management pages
- Can manage inventory and users (when backend is connected)

## Troubleshooting

### **Common Issues:**
1. **"Missing Publishable Key" error**
   - Ensure VITE_CLERK_PUBLISHABLE_KEY is set in .env
   - Restart development server after adding env vars

2. **Infinite redirect loops**
   - Check Clerk dashboard redirect URLs
   - Verify route protection logic

3. **API authentication failures**
   - Ensure backend Clerk keys match frontend
   - Check axios interceptor implementation

4. **Role-based access not working**
   - Verify user metadata is set in Clerk dashboard
   - Check AdminRoute component logic

## Next Steps

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Configure Clerk Application:**
   - Set up real Clerk keys
   - Configure redirect URLs
   - Set up user roles

3. **Test Authentication Flow:**
   - Follow testing checklist above
   - Verify all routes work correctly

4. **Connect to Backend:**
   - Ensure backend Clerk integration is working
   - Test API calls with authentication

## Success Criteria

✅ **Integration Complete When:**
- Users can sign up/sign in successfully
- Protected routes work correctly
- Admin role-based access functions
- API calls include authentication tokens
- Mobile experience is fully functional
- All routes redirect appropriately
