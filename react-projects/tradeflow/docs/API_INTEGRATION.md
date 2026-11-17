# Backend API Integration & Endpoint Specifications

This document outlines the API infrastructure connecting the TradeFlow React frontend to the backend PHP REST service hosted at `https://testapi.humansoflagos.com/`.

---

## 1. Client Configuration

The central HTTP client is defined in `src/api/axios.js`:
- **Base URL**: `https://testapi.humansoflagos.com/`
- **Request Format**: `multipart/form-data` (via `FormData`) for POST endpoints, standard query parameters for GET endpoints.
- **Response Format**: JSON with consistent schema `{ success: boolean, message: string, data: any }`.

---

## 2. Active Live Endpoints

The following endpoints are fully operational and serving live production data:

| Method | Endpoint Route | Description & Parameters |
| :--- | :--- | :--- |
| `POST` | `admin/product/search-product.php` | Live product search.<br>**Params**: `searchContent` (string) |
| `GET` | `admin/category/fetch-all-categories.php` | Retrieves all product categories. |
| `GET` | `admin/product/fetch-all-products.php` | Retrieves full product inventory. |
| `GET` | `admin/customer/fetch-all-customer.php` | Retrieves customer directory for admin management. |
| `POST` | `admin/customer/fetch-each-customer.php` | Retrieves single customer details.<br>**Params**: `customerId` |
| `POST` | `admin/customer/update-customer.php` | Updates customer profile records.<br>**Params**: `customerId`, `firstName`, `lastName`, `emailAddress`, `phoneNumber`, `address`, `statusId`, `roleId` |
| `POST` | `admin/staff/staff-login.php` | Staff & administrator authentication.<br>**Params**: `emailAddress`, `password` |

---

## 3. Customer Portal Module Endpoints (Specification)

To support the 12 customer commerce modules, the following endpoints are implemented with resilient client-side fallbacks in `src/services/customerService.js`:

### 1. Order Tracking (`customer/order/track-order.php`)
- **Method**: `POST`
- **Request Body**: `orderId` (string/number)
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Order tracking retrieved successfully",
    "data": {
      "orderId": "10492",
      "trackingNumber": "TF-TRK-010492",
      "carrier": "TradeFlow Express Logistics",
      "currentStatus": "In Transit",
      "statusId": 3,
      "estimatedDelivery": "2026-11-20",
      "events": [
        { "status": "Order Placed", "timestamp": "2026-11-16 10:30", "completed": true },
        { "status": "Dispatched", "timestamp": "2026-11-17 08:15", "completed": true },
        { "status": "Out for Delivery", "timestamp": null, "completed": false }
      ]
    }
  }
  ```

### 2. Wishlist Management (`customer/wishlist/fetch-wishlist.php` & `toggle-wishlist.php`)
- **Fetch Method**: `POST` | **Params**: `customerId`
- **Toggle Method**: `POST` | **Params**: `customerId`, `productId`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Wishlist updated",
    "data": [{ "productId": "12", "productName": "Industrial Steel Valve", "price": 45000 }]
  }
  ```

### 3. Customer Notifications (`customer/notification/fetch-notifications.php`)
- **Method**: `POST`
- **Request Body**: `customerId`
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "notif_01",
        "title": "Order Dispatched",
        "message": "Order #10492 has left the central warehouse.",
        "read": false,
        "createdAt": "2026-11-17 09:00:00"
      }
    ]
  }
  ```

### 4. Saved Shipping Addresses (`customer/address/fetch-addresses.php`)
- **Method**: `POST`
- **Request Body**: `customerId`
- **Expected Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "ADDR01",
        "label": "Headquarters",
        "recipientName": "Quadri Lasisi",
        "street": "14 Commercial Avenue",
        "city": "Abeokuta",
        "state": "Ogun State",
        "isDefault": true
      }
    ]
  }
  ```

### 5. Help & Support Tickets (`customer/support/submit-ticket.php`)
- **Method**: `POST`
- **Request Body**: `customerId`, `subject`, `category`, `message`, `priority`
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Ticket created successfully",
    "data": {
      "ticketId": "TCK-892104",
      "status": "Open",
      "createdAt": "2026-11-17 14:00:00"
    }
  }
  ```

---

## 4. Graceful Fallback Protocol

If the backend returns HTTP 404, 500, or network timeouts on any of the new customer modules, `customerService.js` automatically activates the **local storage / simulated fallback**:
- UI components receive valid, predictable data structures.
- User operations (adding to wishlist, adding addresses, tracking orders) complete without crashing.
- Once the backend developer deploys the matching PHP script, the frontend switches seamlessly to live database persistence without any code modifications required.
