/**
 * Verify Checkout Integration
 * Quick verification script to check if the new checkout is properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying M-Pesa Checkout Integration...\n');

// Check if old checkout file is removed
const oldCheckoutPath = path.join(__dirname, 'src/pages/CheckoutPage.jsx');
const newCheckoutPath = path.join(__dirname, 'src/pages/CheckoutPage.tsx');

console.log('1. Checking file structure...');
if (fs.existsSync(oldCheckoutPath)) {
  console.log('❌ Old CheckoutPage.jsx still exists - this will cause conflicts');
} else {
  console.log('✅ Old CheckoutPage.jsx removed');
}

if (fs.existsSync(newCheckoutPath)) {
  console.log('✅ New CheckoutPage.tsx exists');
} else {
  console.log('❌ New CheckoutPage.tsx missing');
}

// Check required service files
const orderServicePath = path.join(__dirname, 'src/services/order.service.ts');
const paymentModalPath = path.join(__dirname, 'src/components/PaymentStatusModal.tsx');

console.log('\n2. Checking required components...');
if (fs.existsSync(orderServicePath)) {
  console.log('✅ Order service exists');
} else {
  console.log('❌ Order service missing');
}

if (fs.existsSync(paymentModalPath)) {
  console.log('✅ Payment status modal exists');
} else {
  console.log('❌ Payment status modal missing');
}

// Check App.tsx import
const appPath = path.join(__dirname, 'src/App.tsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  if (appContent.includes("import { CheckoutPage } from './pages/CheckoutPage';")) {
    console.log('✅ App.tsx imports new CheckoutPage correctly');
  } else if (appContent.includes("import CheckoutPage from './pages/CheckoutPage';")) {
    console.log('⚠️  App.tsx uses default import - should use named import');
  } else {
    console.log('❌ App.tsx checkout import not found');
  }
} else {
  console.log('❌ App.tsx not found');
}

// Check M-Pesa context integration
console.log('\n3. Checking M-Pesa integration...');
if (fs.existsSync(newCheckoutPath)) {
  const checkoutContent = fs.readFileSync(newCheckoutPath, 'utf8');
  
  const checks = [
    { name: 'Order service import', pattern: /import.*orderService.*from.*order\.service/ },
    { name: 'Payment modal import', pattern: /import.*PaymentStatusModal.*from/ },
    { name: 'M-Pesa context usage', pattern: /useMpesa/ },
    { name: 'Payment method selection', pattern: /paymentMethod.*mpesa/ },
    { name: 'STK Push integration', pattern: /initiateMpesaPayment/ },
    { name: 'Payment status modal', pattern: /PaymentStatusModal/ }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(checkoutContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} missing`);
    }
  });
}

console.log('\n4. Next steps:');
console.log('📝 Clear browser cache and refresh the page');
console.log('📝 Check browser console for any errors');
console.log('📝 Ensure frontend development server is running');
console.log('📝 Test the checkout flow with items in cart');

console.log('\n🎯 Expected checkout flow:');
console.log('   1. Add items to cart');
console.log('   2. Go to /checkout');
console.log('   3. See 3-step process: Shipping → Payment → Review');
console.log('   4. Select M-Pesa payment method');
console.log('   5. Fill phone number (254712345678 format)');
console.log('   6. Place order and see payment modal');

console.log('\n✨ Verification complete!');
