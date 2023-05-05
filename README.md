
# Online Store API

Online Store API
This is an API for an online store that allows users to create accounts, add products to a cart, and place orders.
## Getting started

## Prerequisites

This project is used by the following companies:

- Node.js
- Express.js
- MongoDB


## Installation

Clone the repository:

```bash
git clone https://github.com/khaled50k/OnlineStoreApi.git
```
Install dependencies: 

```bash
npm install
```
    
Create a .env file with the following environment variables: 

`PORT`: The port number that the server will run on.

`MONGO_URL`: The URL to connect to your MongoDB database.

`PASS_SEC`: The secret key used to encrypt and decrypt user passwords.

`JWT_SEC`: The secret key used to sign and verify JSON Web Tokens for user 

```bash
touch .env
```
   
   
 Install dependencies: 

```bash
npm install
```


## API Reference

#### Authentication

| Method | Endpoint     | Description                |
| :-------- | :------- | :------------------------- |
| `POST` | `/api/auth/register` | Register a new user with email and password.
| `POST` | `/api/auth/login` | Login with email and password and receive a JWT token.

#### Users

| Method | Endpoint     | Description                |
| :-------- | :------- | :------------------------- |
| `GET  ` | `/api/users` | Retrieve a list of all users (admin only).
| `GET  ` | `/api/users/:id` | Retrieve a specific user by ID (admin only).
| `PUT  ` | `/api/users/:id` | Update a user's information (user must be authenticated).
| `DELETE  ` | `/api/users/:id` | Delete a user (admin only).






