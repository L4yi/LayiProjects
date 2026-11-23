# TradeFlow Backend API Specification & Contract Document

**Target Server / Base URL**: `https://tradeflow.niitwebdev.com.ng/tradeflow-api/`  
**Protocol**: HTTPS (REST / JSON / Form-Data)  
**Content-Type**: `multipart/form-data` or `application/x-www-form-urlencoded` or `application/json`  
**Authorization**: `Authorization: Bearer <accessToken>` (where authenticated session applies)  

---

## 1. Global Response Standards & Conventions

All TradeFlow backend PHP endpoints MUST return valid JSON with `Content-Type: application/json; charset=UTF-8` and follow this standardized response envelope:

### Standard Success Response Format (`HTTP 200 OK`)
```json
{
  "success": true,
  "message": "OPERATION COMPLETED SUCCESSFULLY",
  "data": {} // Object or Array of records
}
```

### Standard Error Response Format (`HTTP 400 Bad Request` / `HTTP 401 Unauthorized` / `HTTP 404 Not Found`)
```json
{
  "success": false,
  "message": "Clear, human-readable reason why the request failed.",
  "data": null
}
```

### Critical Security & Architecture Rules for Backend Developers
1. **NEVER return Password Reset OTPs in the JSON Response**:
   - In `admin/auth/forgot-password.php` and `customer/auth/forget-password.php`, the OTP code must be dispatched **out-of-band** via Email / SMS. Never return `"resetOtp"` or `"resetotp"` in the API response JSON.
2. **Server-Side Authorization & IDOR Protection**:
   - `customer/order/fetch-customer-orders.php` and `customer/order/fetch-each-order.php` MUST verify that the requested `customerId` matches the authenticated bearer token session.
3. **Database Consistency & Foreign Keys**:
   - Use snake_case or camelCase consistently. The frontend normalizes both `product_id` and `productId`, `customer_id` and `customerId`.

---

## 2. Setup & Metadata Endpoints

These endpoints provide master lookup data (Statuses, Titles, Roles, Payment Methods).

### 2.1 Fetch All Statuses
- **Endpoint**: `POST setup/fetch-all-status.php`
- **Request Parameters** (Optional):
  - `statusIds` (string): Comma-separated status IDs to filter (e.g. `"1, 2, 4"`).
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "STATUSES FETCHED SUCCESSFULLY",
  "data": [
    { "status_id": "1", "status_name": "Active", "status_category": "General" },
    { "status_id": "2", "status_name": "Inactive", "status_category": "General" },
    { "status_id": "3", "status_name": "Pending", "status_category": "Order" },
    { "status_id": "4", "status_name": "Processing", "status_category": "Order" },
    { "status_id": "5", "status_name": "Delivered", "status_category": "Order" },
    { "status_id": "8", "status_name": "Canceled", "status_category": "Order" },
    { "status_id": "10", "status_name": "Paid", "status_category": "Payment" },
    { "status_id": "13", "status_name": "Refunded", "status_category": "Payment" }
  ]
}
```

### 2.2 Fetch All Titles
- **Endpoint**: `POST setup/fetch-all-title.php`
- **Request Parameters** (Optional):
  - `titleIds` (string): Comma-separated title IDs.
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "TITLES FETCHED SUCCESSFULLY",
  "data": [
    { "title_id": "1", "title_name": "Mr" },
    { "title_id": "2", "title_name": "Mrs" },
    { "title_id": "3", "title_name": "Miss" },
    { "title_id": "4", "title_name": "Dr" },
    { "title_id": "5", "title_name": "Prof" },
    { "title_id": "6", "title_name": "Engr" }
  ]
}
```

### 2.3 Fetch All Roles
- **Endpoint**: `POST setup/fetch-all-role.php`
- **Request Parameters** (Optional):
  - `roleIds` (string): Comma-separated role IDs.
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "ROLES FETCHED SUCCESSFULLY",
  "data": [
    { "role_id": "1", "role_name": "STAFF", "role_category": "Admin" },
    { "role_id": "2", "role_name": "ADMIN", "role_category": "Admin" },
    { "role_id": "3", "role_name": "SUPER ADMIN", "role_category": "Admin" },
    { "role_id": "19", "role_name": "Customer", "role_category": "Customer" }
  ]
}
```

### 2.4 Fetch All Payment Methods
- **Endpoint**: `POST setup/fetch-all-payment-method.php`
- **Request Parameters**: None.
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "PAYMENT METHODS FETCHED SUCCESSFULLY",
  "data": [
    { "payment_method_id": "1", "payment_method_name": "Wallet Balance" },
    { "payment_method_id": "2", "payment_method_name": "Bank Transfer" },
    { "payment_method_id": "3", "payment_method_name": "Debit / Credit Card" }
  ]
}
```

---

## 3. Staff & Admin Authentication

### 3.1 Staff Sign In
- **Endpoint**: `POST admin/auth/sign-in.php`
- **Request Parameters**:
  - `emailAddress` (string, required): e.g. `admin@tradeflow.com`
  - `password` (string, required): Plaintext password
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "LOGIN SUCCESSFUL",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "staff_id": "STF2026110901",
    "first_name": "Olawale",
    "last_name": "Layi",
    "email_address": "admin@tradeflow.com",
    "phone_number": "+2348108725967",
    "role_id": "3",
    "role_name": "SUPER ADMIN",
    "status_id": "1",
    "status_name": "ACTIVE",
    "profile_image": "https://tradeflow.niitwebdev.com.ng/uploads/avatar1.jpg",
    "last_login_date": "2026-11-23 11:20:00"
  }
}
```

### 3.2 Staff Forgot Password
- **Endpoint**: `POST admin/auth/forgot-password.php`
- **Request Parameters**:
  - `emailAddress` (string, required)
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "Password reset OTP sent to your registered email address.",
  "data": {
    "staff_id": "STF2026110901",
    "email_address": "admin@tradeflow.com"
  }
}
```
*(SECURITY: Never include `resetOtp` in JSON).*

### 3.3 Staff Reset Password
- **Endpoint**: `POST admin/auth/reset-password.php`
- **Request Parameters**:
  - `staffId` (string, required)
  - `resetOtp` (string, required): 6-digit OTP code received by user
  - `password` (string, required): New password
  - `confirmPassword` (string, required)
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "PASSWORD RESET SUCCESSFULLY"
}
```

### 3.4 Staff CRUD Endpoints
- `POST admin/staff/fetch-all-staff.php`: Returns array of all staff.
- `POST admin/staff/fetch-each-staff.php`: `staffId` (required) $\rightarrow$ Returns single staff record.
- `POST admin/staff/create-staff.php`:
  - `titleId`, `firstName`, `lastName`, `emailAddress`, `phoneNumber`, `address`, `roleId`, `statusId`, `password`
- `POST admin/staff/update-staff.php`:
  - `staffId`, `titleId`, `firstName`, `lastName`, `emailAddress`, `phoneNumber`, `address`, `roleId`, `statusId`
- `POST admin/staff/delete-staff.php`: `staffId` (required)
- `POST admin/staff/search-staff.php`: `searchQuery` (string)
- `POST admin/upload/upload-image.php`: `file` (binary image) $\rightarrow$ Returns `{ "success": true, "image_url": "..." }`

---

## 4. Customer Authentication & Profile

### 4.1 Customer Registration (Sign Up)
- **Endpoint**: `POST customer/auth/sign-up.php`
- **Request Parameters**:
  - `firstName` (string, required)
  - `lastName` (string, required)
  - `emailAddress` (string, required)
  - `phoneNumber` (string, required)
  - `password` (string, required, min 8 chars)
  - `address` (string, optional)
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "CUSTOMER REGISTRATION SUCCESSFUL",
  "data": {
    "customer_id": "CUST202611200001",
    "firstName": "Quadri",
    "lastName": "Lasisi",
    "emailAddress": "quadri@example.com",
    "phoneNumber": "+2348012345678",
    "address": "Abeokuta, Ogun State, Nigeria"
  }
}
```

### 4.2 Customer Sign In
- **Endpoint**: `POST customer/auth/sign-in.php`
- **Request Parameters**:
  - `emailAddress` (string, required)
  - `password` (string, required)
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "CUSTOMER SIGN IN SUCCESSFUL",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "customer_id": "CUST202611200001",
    "firstName": "Quadri",
    "lastName": "Lasisi",
    "emailAddress": "quadri@example.com",
    "phoneNumber": "+2348012345678",
    "address": "Abeokuta, Ogun State",
    "roleId": "19"
  }
}
```

### 4.3 Customer Forgot & Reset Password
- `POST customer/auth/forget-password.php`: `emailAddress` $\rightarrow$ Dispatches reset OTP to email.
- `POST customer/auth/reset-password.php`: `customerId`, `resetOtp`, `password`, `confirmPassword`.
- `POST customer/auth/change-password.php`: `customerId`, `currentPassword`, `newPassword`.
- `POST customer/profile/update-profile.php`: `customerId`, `firstName`, `lastName`, `phoneNumber`, `address`, `city`, `state`.
- `POST customer/profile/upload-profile-image.php`: `customerId`, `image` (binary).

---

## 5. Products Management (Inventory)

### 5.1 Fetch All Products (Admin & Customer)
- **Endpoint**: `POST admin/product/fetch-all-products.php` (or `customer/product/fetch-all-products.php`)
- **Request Parameters**: None.
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "PRODUCTS FETCHED SUCCESSFULLY",
  "data": [
    {
      "product_id": "PROD20261109083122",
      "product_name": "Samsung Galaxy A15",
      "categories_id": "CAT20261109082827",
      "categories_name": "Mobile Devices & phones",
      "product_price": 185000,
      "quantity": 4, // 0 = Out of Stock, <= 5 = Low Stock Trigger
      "status_id": "1",
      "status_name": "ACTIVE",
      "product_image": "https://tradeflow.niitwebdev.com.ng/uploads/prod1.jpg",
      "description": "Android smartphone with 6.5-inch display, 4GB RAM, 128GB storage."
    }
  ]
}
```

### 5.2 Fetch Single Product
- **Endpoint**: `POST admin/product/fetch-each-product.php`
- **Request Parameters**:
  - `productId` (string, required)

### 5.3 Product Management CRUD
- `POST admin/product/create-product.php`: `productName`, `categoriesId`, `productPrice`, `quantity`, `statusId`, `description`, `image`
- `POST admin/product/update-product.php`: `productId`, `productName`, `categoriesId`, `productPrice`, `quantity`, `statusId`, `description`, `image`
- `POST admin/product/delete-product.php`: `productId`
- `POST admin/product/search-product.php`: `searchQuery`

---

## 6. Categories Management

- `POST admin/categories/fetch-all-category.php` (or `customer/category/fetch-all-category.php`): Returns all categories with `categories_id`, `categories_name`, `status_id`, `category_image`.
- `POST admin/categories/fetch-each-category.php`: `categoriesId`
- `POST admin/categories/create-category.php`: `categoryName`, `statusId`, `categoryImage`
- `POST admin/categories/update-category.php`: `categoriesId`, `categoryName`, `statusId`, `categoryImage`
- `POST admin/categories/delete-category.php`: `categoriesId`
- `POST admin/categories/search-category.php`: `searchQuery`

---

## 7. Orders & Fulfillment

### 7.1 Fetch All Orders (Admin)
- **Endpoint**: `GET admin/order/fetch-all-orders.php`
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "ORDERS FETCHED SUCCESSFULLY",
  "data": [
    {
      "order_id": "ORD20261120001",
      "customer_id": "CUST202611200001",
      "customer_name": "Quadri Lasisi",
      "email_address": "quadri@example.com",
      "phone_number": "+2348012345678",
      "delivery_address": "NIIT Tech Hub, Commercial District, Abeokuta",
      "product_id": "PROD20261109083122",
      "product_name": "Samsung Galaxy A15",
      "product_price": 185000,
      "quantity": 1,
      "payment_method_id": "1",
      "payment_method_name": "Wallet Balance",
      "status_id": "4",
      "status_name": "Processing",
      "created_at": "2026-11-23 10:45:00"
    }
  ]
}
```

### 7.2 Create Order (Customer Storefront Checkout)
- **Endpoint**: `POST customer/order/create-order.php`
- **Request Parameters**:
  - `customerId` (string, required)
  - `productId` (string, required)
  - `paymentMethodId` (string, required): `1` (Wallet), `2` (Bank Transfer), `3` (Card)
  - `deliveryAddress` (string, required)
  - `deliveryPhone` (string, required)
  - `statusId` (string, optional, defaults to `"4"` Processing or `"3"` Pending)
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "ORDER CREATED SUCCESSFULLY",
  "data": {
    "orderId": "ORD20261123104501",
    "customerId": "CUST202611200001",
    "productId": "PROD20261109083122",
    "statusId": "4"
  }
}
```

### 7.3 Fetch Customer Orders (Customer Portal)
- **Endpoint**: `POST customer/order/fetch-customer-orders.php`
- **Request Parameters**:
  - `customerId` (string, required)
  - `statusId` (string, optional)
- **Expected Success Response**: Array of orders belonging ONLY to `customerId`.

### 7.4 Track Order
- **Endpoint**: `POST customer/order/track-order.php`
- **Request Parameters**:
  - `orderId` (string, required)
  - `customerId` (string, optional)
- **Expected Success Response**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD20261123104501",
    "currentStatus": "In Transit",
    "carrier": "TradeFlow Express Logistics",
    "trackingNumber": "TF-TRK-981024",
    "estimatedDelivery": "Friday, Nov 27, 2026",
    "shippingAddress": "NIIT Tech Hub, Abeokuta",
    "productName": "Samsung Galaxy A15"
  }
}
```

---

## 8. Customer Storefront Features

### 8.1 Help & Support Tickets
- **Endpoint**: `POST customer/support/submit-ticket.php`
- **Request Parameters**:
  - `customerId` (string, required)
  - `category` (string, required, e.g. "Orders & Delivery", "Billing", "Account")
  - `orderId` (string, optional)
  - `subject` (string, required)
  - `message` (string, required)
- **Expected Success Response**:
```json
{
  "success": true,
  "message": "TICKET SUBMITTED SUCCESSFULLY",
  "ticketId": "TCK-849201"
}
```
- **Fetch Customer Tickets**: `POST customer/support/fetch-tickets.php` (`customerId`)

### 8.2 Wishlist Management
- `POST customer/wishlist/fetch-wishlist.php`: `customerId`
- `POST customer/wishlist/add-to-wishlist.php`: `customerId`, `productId`
- `POST customer/wishlist/toggle-wishlist.php`: `customerId`, `productId`
- `POST customer/wishlist/remove-wishlist.php`: `customerId`, `productId`
- `POST customer/wishlist/move-to-cart.php`: `customerId`, `productId`

### 8.3 Addresses & Payment Preferences
- `POST customer/address/fetch-addresses.php`: `customerId`
- `POST customer/address/save-address.php`: `customerId`, `label`, `recipientName`, `phone`, `street`, `city`, `state`, `landmark`, `isDefault`
- `POST customer/address/delete-address.php`: `addressId`, `customerId`
- `POST customer/payment/fetch-methods.php`: `customerId`
- `POST customer/payment/save-preference.php`: `customerId`, `defaultMethod`

---

## 9. (Optional) Dedicated Admin Notification Sync Endpoints

If the backend developer wants to implement database-backed cross-device notification persistence for administrators:

### 9.1 Fetch All Admin Notifications
- **Endpoint**: `POST admin/notification/fetch-all.php`
- **Request Parameters**:
  - `category` (string, optional: `"all"`, `"orders"`, `"stock"`, `"users"`, `"support"`)
  - `limit` (number, optional, defaults to 50)
- **Expected Success Response**:
```json
{
  "success": true,
  "unreadCount": 3,
  "data": [
    {
      "id": "ADM-NOTIF-101",
      "type": "stock_out",
      "category": "stock",
      "title": "Out of Stock: Samsung Galaxy A15",
      "message": "Item inventory reached 0 units. Please restock.",
      "severity": "danger",
      "isRead": false,
      "actionLink": "/products?search=Samsung+Galaxy+A15",
      "actionText": "Restock Product",
      "created_at": "2026-11-23 11:15:00"
    },
    {
      "id": "ADM-NOTIF-102",
      "type": "order",
      "category": "orders",
      "title": "New Order #ORD20261123104501",
      "message": "Quadri Lasisi placed an order for ₦185,000",
      "severity": "success",
      "isRead": false,
      "actionLink": "/orders?search=ORD20261123104501",
      "actionText": "View Order",
      "created_at": "2026-11-23 10:45:00"
    }
  ]
}
```

### 9.2 Mark Admin Notification Read
- **Endpoint**: `POST admin/notification/mark-read.php`
- **Request Parameters**:
  - `notificationId` (string, required, or `"all"`)
