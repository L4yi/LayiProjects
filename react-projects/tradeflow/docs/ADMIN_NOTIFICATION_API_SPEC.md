# TradeFlow Admin Notification System — Backend API Specification

This specification document outlines the exact backend endpoints, database schema, and trigger logic required for the backend developer to build the **Admin Notification System** on `tradeflow.niitwebdev.com.ng`.

---

## 1. Database Table Schema (`admin_notifications`)

Create the following table in your MySQL database:

```sql
CREATE TABLE IF NOT EXISTS `admin_notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `notification_id` VARCHAR(50) NOT NULL UNIQUE,
  `type` ENUM('order', 'stock_out', 'stock_low', 'user', 'support') NOT NULL,
  `category` ENUM('orders', 'stock', 'users', 'support') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `severity` ENUM('info', 'warning', 'danger', 'success') DEFAULT 'info',
  `entity_id` VARCHAR(100) NULL COMMENT 'order_id, product_id, customer_id, or ticket_id',
  `action_link` VARCHAR(255) NOT NULL,
  `action_text` VARCHAR(50) NOT NULL DEFAULT 'View Details',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 2. Notification System Endpoints

### Endpoint 1: Fetch All Admin Notifications
Retrieves the list of admin notifications with unread counts and optional category filtering.

- **URL**: `POST https://tradeflow.niitwebdev.com.ng/tradeflow-api/admin/notification/fetch-all.php`
- **Headers**:
  - `Accept: application/json`
  - `Authorization: Bearer <accessToken>` (optional or for admin verification)
- **Request Parameters** (FormData or JSON, all optional):
  - `category` (string): `"all"` | `"orders"` | `"stock"` | `"users"` | `"support"` (defaults to `"all"`)
  - `status` (string): `"all"` | `"unread"` | `"read"` (defaults to `"all"`)
  - `limit` (integer): Number of items to return (default: `50`)

#### Expected Success Response (`HTTP 200 OK`):
```json
{
  "success": true,
  "message": "ADMIN NOTIFICATIONS FETCHED SUCCESSFULLY",
  "unreadCount": 3,
  "categoryCounts": {
    "all": 5,
    "orders": 2,
    "stock": 1,
    "users": 1,
    "support": 1
  },
  "data": [
    {
      "id": "NOTIF-105",
      "notificationId": "NOTIF-105",
      "type": "stock_out",
      "category": "stock",
      "title": "Out of Stock: Samsung Galaxy A15",
      "message": "Item inventory reached 0 units. Customer orders are blocked until restocked.",
      "severity": "danger",
      "isRead": false,
      "entityId": "PROD20261109083122",
      "actionLink": "/products?search=Samsung+Galaxy+A15",
      "actionText": "Restock Product",
      "time": "5 minutes ago",
      "createdAt": "2026-11-23 13:25:00"
    },
    {
      "id": "NOTIF-104",
      "notificationId": "NOTIF-104",
      "type": "order",
      "category": "orders",
      "title": "New Order #ORD20261123104501",
      "message": "Quadri Lasisi placed an order for ₦185,000 via Wallet Balance.",
      "severity": "success",
      "isRead": false,
      "entityId": "ORD20261123104501",
      "actionLink": "/orders?search=ORD20261123104501",
      "actionText": "View Order",
      "time": "12 minutes ago",
      "createdAt": "2026-11-23 13:18:00"
    },
    {
      "id": "NOTIF-103",
      "notificationId": "NOTIF-103",
      "type": "stock_low",
      "category": "stock",
      "title": "Low Stock Warning: Nike Air Max",
      "message": "Only 3 units remaining in inventory.",
      "severity": "warning",
      "isRead": false,
      "entityId": "PROD20261109083199",
      "actionLink": "/products?search=Nike+Air+Max",
      "actionText": "Restock Product",
      "time": "1 hour ago",
      "createdAt": "2026-11-23 12:30:00"
    },
    {
      "id": "NOTIF-102",
      "notificationId": "NOTIF-102",
      "type": "support",
      "category": "support",
      "title": "New Support Ticket #TCK-849201",
      "message": "Quadri Lasisi: 'Orders & Delivery: Delayed shipping status'",
      "severity": "info",
      "isRead": true,
      "entityId": "TCK-849201",
      "actionLink": "/customer-support",
      "actionText": "Review Ticket",
      "time": "2 hours ago",
      "createdAt": "2026-11-23 11:30:00"
    },
    {
      "id": "NOTIF-101",
      "notificationId": "NOTIF-101",
      "type": "user",
      "category": "users",
      "title": "New Customer Registered",
      "message": "Quadri Lasisi (quadri@example.com) created an account.",
      "severity": "info",
      "isRead": true,
      "entityId": "CUST202611200001",
      "actionLink": "/customers?search=quadri%40example.com",
      "actionText": "View Customer",
      "time": "Yesterday",
      "createdAt": "2026-11-22 17:00:00"
    }
  ]
}
```

---

### Endpoint 2: Mark Notification(s) as Read
Marks a single notification or all notifications as read.

- **URL**: `POST https://tradeflow.niitwebdev.com.ng/tradeflow-api/admin/notification/mark-read.php`
- **Request Parameters** (FormData or JSON):
  - `notificationId` (string, required): Either the specific ID (e.g. `"NOTIF-104"`) or `"all"` to mark every notification as read.

#### Expected Success Response (`HTTP 200 OK`):
```json
{
  "success": true,
  "message": "NOTIFICATIONS MARKED AS READ",
  "unreadCount": 0
}
```

#### Expected Error Response:
```json
{
  "success": false,
  "message": "Notification ID is required."
}
```

---

### Endpoint 3: Delete / Dismiss Notification
Deletes a notification from the admin notification feed.

- **URL**: `POST https://tradeflow.niitwebdev.com.ng/tradeflow-api/admin/notification/delete-notification.php`
- **Request Parameters**:
  - `notificationId` (string, required): Specific notification ID to remove, or `"all"` to clear the list.

#### Expected Success Response (`HTTP 200 OK`):
```json
{
  "success": true,
  "message": "NOTIFICATION DELETED SUCCESSFULLY",
  "unreadCount": 2
}
```

---

### Endpoint 4: Lightweight Unread Count (Heartbeat)
Lightweight polling endpoint to fetch just the unread badge count without querying the full list of notifications.

- **URL**: `POST https://tradeflow.niitwebdev.com.ng/tradeflow-api/admin/notification/get-unread-count.php`
- **Request Parameters**: None.

#### Expected Success Response (`HTTP 200 OK`):
```json
{
  "success": true,
  "unreadCount": 3
}
```

---

## 3. How the Backend Generates the 5 Triggers

The backend developer can automatically insert a record into `admin_notifications` when any of the following 5 business events occur:

### Trigger 1: New Customer Order
- **Where to insert**: Inside `customer/order/create-order.php` after order row is saved.
```sql
INSERT INTO `admin_notifications` 
(`notification_id`, `type`, `category`, `title`, `message`, `severity`, `entity_id`, `action_link`, `action_text`)
VALUES 
(CONCAT('NOTIF-ORD-', UNIX_TIMESTAMP()), 'order', 'orders', 
 CONCAT('New Order #', :orderId), 
 CONCAT(:customerName, ' placed an order for ₦', FORMAT(:orderPrice, 2)), 
 'success', :orderId, CONCAT('/orders?search=', :orderId), 'View Order');
```

### Trigger 2 & 3: Out-of-Stock and Low-Stock Alert
- **Where to insert**: Inside `admin/product/update-product.php` and whenever an order reduces product inventory.
- **Rule**:
  - If new `quantity == 0`:
    ```sql
    INSERT INTO `admin_notifications` 
    (`notification_id`, `type`, `category`, `title`, `message`, `severity`, `entity_id`, `action_link`, `action_text`)
    VALUES 
    (CONCAT('NOTIF-STK-OUT-', :productId, '-', UNIX_TIMESTAMP()), 'stock_out', 'stock', 
     CONCAT('Out of Stock: ', :productName), 
     'Item inventory reached 0 units. Customer orders are blocked until restocked.', 
     'danger', :productId, CONCAT('/products?search=', :productName), 'Restock Product');
    ```
  - If new `quantity > 0 AND quantity <= 5`:
    ```sql
    INSERT INTO `admin_notifications` 
    (`notification_id`, `type`, `category`, `title`, `message`, `severity`, `entity_id`, `action_link`, `action_text`)
    VALUES 
    (CONCAT('NOTIF-STK-LOW-', :productId, '-', UNIX_TIMESTAMP()), 'stock_low', 'stock', 
     CONCAT('Low Stock Warning: ', :productName), 
     CONCAT('Only ', :quantity, ' units remaining in inventory.'), 
     'warning', :productId, CONCAT('/products?search=', :productName), 'Restock Product');
    ```

### Trigger 4: New User Registration
- **Where to insert**: Inside `customer/auth/sign-up.php` after new customer row is created.
```sql
INSERT INTO `admin_notifications` 
(`notification_id`, `type`, `category`, `title`, `message`, `severity`, `entity_id`, `action_link`, `action_text`)
VALUES 
(CONCAT('NOTIF-USR-', UNIX_TIMESTAMP()), 'user', 'users', 
 'New Customer Registered', 
 CONCAT(:customerName, ' (', :customerEmail, ') created an account.'), 
 'info', :customerId, CONCAT('/customers?search=', :customerEmail), 'View Customer');
```

### Trigger 5: New Support Ticket
- **Where to insert**: Inside `customer/support/submit-ticket.php` after ticket is submitted.
```sql
INSERT INTO `admin_notifications` 
(`notification_id`, `type`, `category`, `title`, `message`, `severity`, `entity_id`, `action_link`, `action_text`)
VALUES 
(CONCAT('NOTIF-TCK-', UNIX_TIMESTAMP()), 'support', 'support', 
 CONCAT('New Support Ticket #', :ticketId), 
 CONCAT(:customerName, ': "', :category, ' - ', :subject, '"'), 
 'info', :ticketId, '/customers', 'Review Ticket');
```
