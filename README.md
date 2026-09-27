# OST API Testing — Food Delivery API

A small REST API developed as the implementation for the Open Source Technologies Case Study:

**Case Study 11 — API Testing for a Food Delivery Application**

The API provides authentication, product management, order creation, and payment operations. It is designed to demonstrate functional API testing, authentication, input validation, error handling, and business-rule validation using Postman.

## Technologies

- Node.js
- Express.js
- REST API
- HTTP/JSON
- Postman

## Requirements

- Node.js
- npm
- Postman

## Running the API

Clone the repository and install the dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The API runs at:

```
http://localhost:3000
```

## Demo Credentials

The API provides demo authentication credentials:

```
Email: student@example.com
Password: password123
```

The demonstration API returns:

```
demo-token
```

This is a dummy token used only for the local testing environment.

## Main Endpoints

### Authentication
```
POST /api/auth/login
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders
```
POST /api/orders
GET  /api/orders
POST /api/orders/:id/pay
```

## Case Study Test Scenarios

The Postman collection included in this repository contains the API requests used for testing.

The main Case Study scenarios are:

- Valid order creation
- Duplicate pending order
- Invalid product
- Invalid quantity
- Missing authentication
- Successful payment
- Attempt to pay an already-paid order

The expected error conditions include:

- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 409 Conflict

Successful operations include:

- 200 OK
- 201 Created

## Postman Collection

The repository contains the exported Postman collection:

```
OST_API_Testing_Error_Handling.json
```

Import this file into Postman to reproduce the API testing scenarios.

The collection contains requests for authentication, product operations, order creation, validation errors, duplicate-order handling, and payment processing.

## Project Structure

```
ost_api_testing/
├── server.js
├── package.json
├── package-lock.json
├── OST_API_Testing_Error_Handling.json
├── README.md
└── .gitignore
```

## Purpose

This project was developed as practical evidence for the Open Source Technologies Case Study on API Testing and Error Handling.

The accompanying Case Study report documents the testing methodology, test scenarios, HTTP responses, error handling, observations, and recommendations.
