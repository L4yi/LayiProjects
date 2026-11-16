# TradeFlow API Specification: Customer Modules & Settings

**Base URL**: `https://tradeflow.niitwebdev.com.ng/tradeflow-api/`  
**Protocol**: `HTTPS`  
**Request Format**: `POST` (`multipart/form-data` or `application/x-www-form-urlencoded` - read via `$_POST` & `$_FILES`)  
**Response Format**: `JSON` (`{ "success": boolean, "message": string, "data": ... }`)

---

## Quick Summary of Endpoints

| # | Feature | Endpoint Path | Method | Key Parameters |
|---|---|---|---|---|
| 1 | **Track Orders** | `customer/order/track-order.php` | `POST` | `orderId`, `customerId` |
| 2 | **Customer Orders** | `customer/order/fetch-customer-orders.php` | `POST` | `customerId`, `statusId` (optional) |
| 3 | **Fetch Wishlist** | `customer/wishlist/fetch-wishlist.php` | `POST` | `customerId` |
| 4 | **Toggle Wishlist** | `customer/wishlist/toggle-wishlist.php` | `POST` | `customerId`, `productId` |
| 5 | **Remove Wishlist** | `customer/wishlist/remove-wishlist.php` | `POST` | `customerId`, `productId` |
| 6 | **Fetch Notifications** | `customer/notification/fetch-notifications.php` | `POST` | `customerId`, `unreadOnly` (optional) |
| 7 | **Mark Notification Read** | `customer/notification/mark-read.php` | `POST` | `customerId`, `notificationId`, `all` (optional) |
| 8 | **Fetch Addresses** | `customer/address/fetch-addresses.php` | `POST` | `customerId` |
| 9 | **Save Address** | `customer/address/save-address.php` | `POST` | `customerId`, `addressId` (opt), `label`, `recipientName`, `phoneNumber`, `streetAddress`, `city`, `state`, `isDefault` |
| 10 | **Delete Address** | `customer/address/delete-address.php` | `POST` | `customerId`, `addressId` |
| 11 | **Payment Preferences** | `customer/payment/fetch-methods.php` | `POST` | `customerId` |
| 12 | **Save Payment Pref** | `customer/payment/save-preference.php` | `POST` | `customerId`, `defaultMethod` |
| 13 | **Submit Support Ticket**| `customer/support/submit-ticket.php` | `POST` | `customerId`, `orderId` (opt), `category`, `subject`, `message` |
| 14 | **Fetch Support Tickets**| `customer/support/fetch-tickets.php` | `POST` | `customerId` |
| 15 | **Update Profile** | `customer/profile/update-profile.php` | `POST` | `customerId`, `firstName`, `lastName`, `phoneNumber`, `address` |
| 16 | **Upload Profile Photo** | `customer/profile/upload-profile-image.php` | `POST` | `customerId`, `profile_image` (file) |
| 17 | **Change Password** | `customer/auth/change-password.php` | `POST` | `customerId`, `oldPassword`, `newPassword` |
| 18 | **Customer Details (Admin)**| `admin/customer/fetch-each-customer.php` | `POST` | `customerId` *(add `profile_image` to `SELECT`)* |

---

## Database Schemas Needed (MySQL)

```sql
-- 1. Wishlist Table
CREATE TABLE IF NOT EXISTS customer_wishlist_tab (
    sn INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_cust_prod (customer_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Notifications Table
CREATE TABLE IF NOT EXISTS customer_notification_tab (
    sn INT AUTO_INCREMENT PRIMARY KEY,
    notification_id VARCHAR(50) NOT NULL UNIQUE,
    customer_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'order', -- 'order', 'promo', 'security', 'system'
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cust_notif (customer_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Saved Addresses Table
CREATE TABLE IF NOT EXISTS customer_address_tab (
    sn INT AUTO_INCREMENT PRIMARY KEY,
    address_id VARCHAR(50) NOT NULL UNIQUE,
    customer_id VARCHAR(50) NOT NULL,
    label VARCHAR(50) DEFAULT 'Home', -- 'Home', 'Office', 'Warehouse', 'Other'
    recipient_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    street_address TEXT NOT NULL,
    city VARCHAR(60) NOT NULL,
    state VARCHAR(60) NOT NULL,
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cust_addr (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Support Tickets Table
CREATE TABLE IF NOT EXISTS customer_support_ticket_tab (
    sn INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL UNIQUE,
    customer_id VARCHAR(50) NOT NULL,
    order_id VARCHAR(50) DEFAULT NULL,
    category VARCHAR(60) NOT NULL, -- 'Delivery', 'Refund', 'Product Quality', 'Payment Issue', 'Other'
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved', 'Closed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cust_ticket (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Detailed Endpoint Specifications

### 1. Track Order (`customer/order/track-order.php`)
- **Method**: `POST`
- **Parameters**:
  - `orderId` (Required, string e.g. `ORD20261111143445`)
  - `customerId` (Optional, string)
- **Response**:
```json
{
  "success": true,
  "message": "ORDER TRACKING RETRIEVED",
  "data": {
    "orderId": "ORD20261111143445",
    "status": "In Transit",
    "statusId": 3,
    "carrier": "TradeFlow Express Logistics",
    "trackingNumber": "TF-TRK-8829104",
    "estimatedDelivery": "2026-11-20",
    "shippingAddress": "Ibara, Abeokuta, Ogun State, Nigeria",
    "recipientName": "omo Layi",
    "recipientPhone": "+2348108725967",
    "items": [
      {
        "productId": "PROD20261112124611",
        "productName": "Sony WH-1000XM5 Wireless Headphones",
        "quantity": 1,
        "price": 385000,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
      }
    ],
    "milestones": [
      { "title": "Order Placed", "time": "2026-11-16 10:15 AM", "completed": true },
      { "title": "Payment Confirmed", "time": "2026-11-16 10:16 AM", "completed": true },
      { "title": "Processing & Packed", "time": "2026-11-16 02:40 PM", "completed": true },
      { "title": "In Transit", "time": "2026-11-17 08:30 AM", "completed": true },
      { "title": "Out for Delivery", "time": "Expected Nov 19", "completed": false },
      { "title": "Delivered", "time": "Expected Nov 20", "completed": false }
    ]
  }
}
```

---

### 2. Wishlist Endpoints

#### 2A. Fetch Wishlist (`customer/wishlist/fetch-wishlist.php`)
- **Method**: `POST`
- **Parameters**: `customerId` (Required)
- **Response**:
```json
{
  "success": true,
  "message": "WISHLIST FETCHED",
  "data": [
    {
      "productId": "PROD20261112124611",
      "productName": "Sony WH-1000XM5 Wireless Headphones",
      "categoryName": "Audio & Sound Devices",
      "price": 385000,
      "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "inStock": true,
      "addedAt": "2026-11-16 18:20:00"
    }
  ]
}
```

#### 2B. Toggle Wishlist (`customer/wishlist/toggle-wishlist.php`)
- **Method**: `POST`
- **Parameters**: `customerId` (Required), `productId` (Required)
- **Response**:
```json
{
  "success": true,
  "message": "WISHLIST UPDATED",
  "action": "added"
}
```

---

### 3. Notifications Endpoints

#### 3A. Fetch Notifications (`customer/notification/fetch-notifications.php`)
- **Method**: `POST`
- **Parameters**: `customerId` (Required), `unreadOnly` (Optional: 1 or 0)
- **Response**:
```json
{
  "success": true,
  "message": "NOTIFICATIONS FETCHED",
  "data": [
    {
      "notificationId": "NOTIF20261116120001",
      "title": "Order Placed Successfully",
      "message": "Your order #ORD20261111143445 has been confirmed and is being processed.",
      "type": "order",
      "isRead": false,
      "createdAt": "2026-11-16 10:15:20"
    }
  ]
}
```

#### 3B. Mark Notification Read (`customer/notification/mark-read.php`)
- **Method**: `POST`
- **Parameters**: `customerId` (Required), `notificationId` (Optional), `all` (Optional: 1)
- **Response**:
```json
{
  "success": true,
  "message": "NOTIFICATIONS MARKED AS READ"
}
```

---

### 4. Saved Addresses Endpoints

#### 4A. Fetch Addresses (`customer/address/fetch-addresses.php`)
- **Method**: `POST`
- **Parameters**: `customerId` (Required)
- **Response**:
```json
{
  "success": true,
  "message": "ADDRESSES RETRIEVED",
  "data": [
    {
      "addressId": "ADDR2026111601",
      "label": "Home",
      "recipientName": "omo Layi",
      "phoneNumber": "+2348108725967",
      "streetAddress": "12 TradeFlow Crescent, Ibara Housing Estate",
      "city": "Abeokuta",
      "state": "Ogun State",
      "isDefault": true
    }
  ]
}
```

#### 4B. Save Address (`customer/address/save-address.php`)
- **Method**: `POST`
- **Parameters**:
  - `customerId` (Required)
  - `addressId` (Optional: if provided, update existing; if omitted, insert new)
  - `label` (Required: 'Home', 'Office', 'Other')
  - `recipientName` (Required)
  - `phoneNumber` (Required)
  - `streetAddress` (Required)
  - `city` (Required)
  - `state` (Required)
  - `isDefault` (Optional: 1 or 0)
- **Response**:
```json
{
  "success": true,
  "message": "ADDRESS SAVED SUCCESSFULLY",
  "data": {
    "addressId": "ADDR2026111601"
  }
}
```

#### 4C. Delete Address (`customer/address/delete-address.php`)
- **Method**: `POST`
- **Parameters**: `customerId` (Required), `addressId` (Required)
- **Response**:
```json
{
  "success": true,
  "message": "ADDRESS DELETED SUCCESSFULLY"
}
```

---

### 5. Payment Methods (`customer/payment/fetch-methods.php`)
- **Method**: `POST`
- **Parameters**: `customerId` (Required)
- **Response**:
```json
{
  "success": true,
  "message": "PAYMENT METHODS RETRIEVED",
  "data": {
    "defaultMethod": "bank_transfer",
    "walletBalance": 25000,
    "officialBank": {
      "bankName": "Moniepoint Microfinance Bank",
      "accountNumber": "8108725967",
      "accountName": "TradeFlow Global Retail / NIIT Tech Hub"
    },
    "savedCards": [
      {
        "cardId": "CARD2026111601",
        "brand": "mastercard",
        "last4": "4242",
        "expiry": "12/28",
        "isDefault": true
      }
    ]
  }
}
```

---

### 6. Help & Support Tickets (`customer/support/submit-ticket.php`)
- **Method**: `POST`
- **Parameters**:
  - `customerId` (Required)
  - `orderId` (Optional)
  - `category` (Required e.g. 'Delivery', 'Refund', 'Product Quality', 'Payment Issue', 'Other')
  - `subject` (Required)
  - `message` (Required)
- **Response**:
```json
{
  "success": true,
  "message": "SUPPORT TICKET SUBMITTED SUCCESSFULLY",
  "data": {
    "ticketId": "TCK20261116001",
    "status": "Open",
    "createdAt": "2026-11-16 22:45:00"
  }
}
```

---

### 7. Profile & Settings Endpoints

#### 7A. Update Profile Details (`customer/profile/update-profile.php`)
- **Method**: `POST`
- **Parameters**: `customerId`, `firstName`, `lastName`, `phoneNumber`, `address`
- **SQL Action**: `UPDATE customer_tab SET first_name=:firstName, last_name=:lastName, phone_number=:phoneNumber, address=:address, updated_at=NOW() WHERE customer_id=:customerId;`
- **Response**:
```json
{
  "success": true,
  "message": "PROFILE UPDATED SUCCESSFULLY",
  "data": {
    "customerId": "CUST20261111143445",
    "firstName": "omo",
    "lastName": "Layi",
    "phoneNumber": "+2348108725967",
    "address": "scotland, brazil"
  }
}
```

#### 7B. Upload Profile Photo (`customer/profile/upload-profile-image.php`)
- **Method**: `POST` (`multipart/form-data`)
- **Parameters**: `customerId`, `profile_image` (File binary)
- **SQL Action**: `UPDATE customer_tab SET profile_image=:imageUrl, updated_at=NOW() WHERE customer_id=:customerId;`
- **Response**:
```json
{
  "success": true,
  "message": "PROFILE PICTURE UPLOADED SUCCESSFULLY",
  "data": {
    "customerId": "CUST20261111143445",
    "profileImage": "https://tradeflow.niitwebdev.com.ng/tradeflow-api/uploads/profiles/profile_20261116_abc123.png",
    "imageUrl": "https://tradeflow.niitwebdev.com.ng/tradeflow-api/uploads/profiles/profile_20261116_abc123.png"
  }
}
```

#### 7C. Change Password (`customer/auth/change-password.php`)
- **Method**: `POST`
- **Parameters**: `customerId`, `oldPassword`, `newPassword`
- **Response**:
```json
{
  "success": true,
  "message": "PASSWORD CHANGED SUCCESSFULLY"
}
```

#### 7D. Fix in Existing Customer Admin Endpoints
In `admin/customer/fetch-each-customer.php` and `admin/customer/fetch-all-customer.php`:
Add `profile_image` to the SQL query:
```sql
SELECT sn, customer_id, title_id, first_name, last_name, email_address, 
       phone_number, address, profile_image, status_id, role_id, reset_otp, 
       last_login_date, created_at, updated_at 
FROM customer_tab;
```
