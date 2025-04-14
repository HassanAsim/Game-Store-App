# Game Store App

A full-stack e-commerce web application for gaming products built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- 🛍️ Browse and search gaming products
- 🔍 Filter products by category, brand, and price
- 🛒 Shopping cart functionality
- 👤 User authentication and authorization
- 💳 Order processing and management
- ⭐ Product reviews and ratings
- 👨‍💼 Admin dashboard for product management
- 📱 Responsive design

## Technologies Used

### Frontend
- React.js
- Bootstrap
- CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

## Prerequisites

Before running this application, make sure you have:
- Node.js
- MongoDB Atlas account
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/HassanAsim/Game-Store-App.git
cd Game-Store-App
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npx nodemon server.js
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure
```
Gaming-Product-App/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   ├── seeder.js
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Features in Detail

### User Features
- Browse products with filtering and search
- View detailed product information
- Add products to cart
- Manage cart items
- Place orders
- View order history
- Write product reviews
- User authentication
- Profile management

### Admin Features
- Product management (CRUD operations)
- View all products
- Add new products
- Update existing products
- Delete products

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
