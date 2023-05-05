
## API Reference

#### Authentication

| Method | Endpoint     | Description                |
| :-------- | :------- | :------------------------- |
| `POST` | `/api/auth/register` | Register a new user with email and password.
| `POST` | `/api/auth/login` | Login with email and password and receive a JWT token.

**all requests must have header(token)**
ex- token: bearar token

#### Users

| Method | Endpoint     | Description                |
| :-------- | :------- | :------------------------- |
| `GET  ` | `/api/user` | Retrieve a list of all users (admin only).
| `GET  ` | `/api/user/:id` | Retrieve a specific user by ID (admin only).
| `PUT  ` | `/api/user/:id` | Update a user's information (user must be authenticated).
| `DELETE  ` | `/api/user/:id` | Delete a user (admin only).

#### Products

| Method | Endpoint     | Description                |
| :-------- | :------- | :------------------------- |
| `GET  ` | `/api/product` | Retrieve a list of all products.
| `GET  ` | `/api/product/:id` | Retrieve a specific product by ID.
| `POST  ` | `/api/product/` | Add a new product (admin only).
| `PUT  ` | `/api/product/:id` | Update a product (admin only).
| `DELETE  ` | `/api/product/:id` | Delete a product (admin only).







