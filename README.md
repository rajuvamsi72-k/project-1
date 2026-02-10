# Expense Tracker - Full Stack Application

A complete full-stack expense tracking application with Node.js/Express backend and vanilla HTML/CSS/JavaScript frontend.

## Project Structure

```
expense tracker/
├── backend/          # Node.js Express server
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── database/
│   └── utils/
└── frontend/         # HTML/CSS/JS frontend
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── server.js
    └── package.json
```

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies (already in package.json):
```bash
npm install
```

Create a `.env` file in the backend folder with:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Start the frontend server:
```bash
node server.js
```

Or use npm:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Features

### Authentication
- **Register**: Create a new account with name, email, and password
- **Login**: Sign in with email and password
- **JWT Authentication**: Secure token-based authentication

### Expense Management
- **Add Expense**: Create new expenses with title, amount, category, and date
- **View Expenses**: See all your expenses in a organized list
- **Edit Expense**: Update existing expense details
- **Delete Expense**: Remove expenses you no longer need
- **Categories**: Organize by Food, Transport, Entertainment, Utilities, Shopping, Other

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses (Protected - requires JWT token)
- `POST /api/expenses/add` - Add new expense
- `GET /api/expenses` - Get all user expenses
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense

## Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **Vanilla JavaScript** - Interactivity and API calls
- **LocalStorage** - JWT token persistence

## How It Works

1. **User Registration/Login**: 
   - Frontend sends credentials to backend
   - Backend validates and returns JWT token
   - Frontend stores token in localStorage

2. **Expense Operations**:
   - Frontend includes JWT token in Authorization header
   - Backend middleware verifies token
   - Only authenticated users can access expense endpoints
   - Each expense is tied to the user's ID

3. **Real-time Updates**:
   - After any operation (add/edit/delete), expenses list is refreshed
   - User sees immediate updates in the UI

## Running Both Servers Simultaneously

### Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

Then open your browser to `http://localhost:3000`

## Troubleshooting

### Frontend not connecting to backend?
- Ensure backend is running on port 5000
- Check that CORS is enabled in backend
- Check browser console for error messages

### MongoDB connection error?
- Verify MongoDB URI in .env file
- Check MongoDB credentials and cluster access
- Ensure whitelist IP in MongoDB Atlas

### CORS error?
- CORS middleware should be enabled in backend app.js
- Check that frontend URL matches CORS configuration

## Future Enhancements

- Add expense filtering and search
- Monthly/yearly expense reports
- Expense statistics and charts
- Budget limits and alerts
- Multiple users and expense sharing
- Mobile app version
- Dark mode
