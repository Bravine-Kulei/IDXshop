# Frontend Troubleshooting Guide - Sign In/Sign Up Buttons Not Visible

## 🔍 **DIAGNOSTIC CHECKLIST**

### **Step 1: Check Browser Console**
1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Look for errors** related to:
   - Clerk initialization
   - Environment variables
   - Component rendering
   - Network requests

### **Step 2: Verify Environment Variables**
1. **In browser console, type:**
   ```javascript
   console.log('VITE_CLERK_PUBLISHABLE_KEY:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
   console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
   ```
2. **Expected output:**
   - VITE_CLERK_PUBLISHABLE_KEY: should start with "pk_test_"
   - VITE_API_URL: should be "http://localhost:3000/api"

### **Step 3: Check Clerk Loading State**
1. **In browser console, type:**
   ```javascript
   console.log('Clerk object:', window.Clerk);
   console.log('Clerk loaded:', !!window.Clerk);
   ```

### **Step 4: Verify React Components**
1. **Check if Header component is rendering**
2. **Look for any TypeScript/JavaScript errors**
3. **Verify all imports are working**

## 🛠️ **COMMON ISSUES & SOLUTIONS**

### **Issue 1: Environment Variables Not Loading**
**Symptoms:** Console shows `undefined` for environment variables
**Solution:**
```bash
# Stop the frontend server (Ctrl+C)
# Restart the frontend server
cd frontend
npm run dev
```

### **Issue 2: Clerk Not Initializing**
**Symptoms:** `window.Clerk` is undefined
**Solutions:**
1. **Check network connectivity to Clerk servers**
2. **Verify Clerk publishable key is valid**
3. **Check for ad blockers blocking Clerk**

### **Issue 3: Component Import Errors**
**Symptoms:** Console shows import/module errors
**Solution:**
```bash
# Reinstall dependencies
cd frontend
npm install
```

### **Issue 4: CSS/Styling Issues**
**Symptoms:** Buttons exist but are invisible
**Solution:**
1. **Check if Tailwind CSS is loading**
2. **Inspect element to see if buttons are there but hidden**

## 🧪 **TESTING STEPS**

### **Test 1: Basic Page Load**
1. **Navigate to:** `http://localhost:5173`
2. **Expected:** Homepage loads with dark theme
3. **Check:** Header is visible at the top

### **Test 2: Header Component**
1. **Look for:** G20Shop logo in top-left
2. **Look for:** Navigation menu (Home, Products, Support, About)
3. **Look for:** Right side of header should have Sign In/Sign Up buttons

### **Test 3: Mobile View**
1. **Resize browser** to mobile width (< 768px)
2. **Look for:** Hamburger menu icon (☰)
3. **Click hamburger menu**
4. **Expected:** Mobile menu opens with Sign In/Sign Up buttons

## 🔧 **QUICK FIXES**

### **Fix 1: Hard Refresh**
```
Ctrl + F5 (Windows) or Cmd + Shift + R (Mac)
```

### **Fix 2: Clear Browser Cache**
```
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

### **Fix 3: Check Different Browser**
Try opening in:
- Chrome (incognito mode)
- Firefox (private mode)
- Edge

## 📱 **WHAT YOU SHOULD SEE**

### **Desktop View:**
```
[G20Shop] [Home] [Products] [Support] [About]     [🔍] [Sign In] [Sign Up]
```

### **Mobile View:**
```
[G20Shop]                                                    [☰]
```

When hamburger menu is clicked:
```
[G20Shop]                                                    [☰]
├─ Home
├─ Products  
├─ Support
├─ About
├─ Sign In
└─ Sign Up
```

## 🚨 **IF STILL NOT WORKING**

### **Check These Files:**
1. **`frontend/src/main.tsx`** - Clerk provider setup
2. **`frontend/src/components/Header.tsx`** - Sign In/Sign Up buttons
3. **`frontend/.env`** - Environment variables
4. **Browser console** - Any error messages

### **Restart Everything:**
```bash
# Stop frontend (Ctrl+C)
# Stop backend (Ctrl+C)

# Restart backend
cd backend
npm run dev

# Restart frontend  
cd frontend
npm run dev
```

## 📞 **NEXT STEPS**

If you still can't see the Sign In/Sign Up buttons:

1. **Take a screenshot** of what you see
2. **Copy any console errors**
3. **Tell me:**
   - What browser you're using
   - What URL you're visiting
   - What you see instead of the buttons

**The buttons should be clearly visible in the top-right corner of the header!**
