# SB Stocks - Stock Trading Simulation Platform

A full-stack stock trading simulation web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can simulate buying and selling US stocks using virtual funds with secure authentication, portfolio tracking, and role-based access control.

![Tech Stack](https://img.shields.io/badge/MERN-Stack-green) ![License](https://img.shields.io/badge/license-ISC-blue)

## ✨ Features

### 👤 Authentication
- User registration and login with JWT
- HTTP-only cookie-based token storage
- Role-based access control (User / Admin)
- Protected routes on frontend and backend

### 📈 Stock Trading
- Browse 20+ US stocks with real-time simulation data
- Search stocks by symbol or company name
- Filter stocks by sector
- Buy and sell stocks with virtual funds ($100,000 starting balance)
- Insufficient funds and share validation
- Grid and table view modes

### 📊 Portfolio Management
- View current holdings with quantity and average buy price
- Real-time profit/loss calculations
- Total invested vs. current value tracking
- Available balance display

### 📋 Transaction History
- Complete record of all buy/sell transactions
- Filter by transaction type
- Timestamps and execution price tracking

### 🛠️ Admin Panel
- Add, edit, and delete stock listings
- View platform statistics (users, transactions, volume)
- Monitor recent trading activity

### 📉 Charts
- Interactive stock price charts using Chart.js
- 30-day historical price data visualization

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Redux Toolkit, React Router v7, Tailwind CSS v4, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT, bcryptjs, HTTP-only cookies |
| **Security** | Helmet, CORS, Rate Limiting, Mongo Sanitize, express-validator |

## 📁 Project Structure

```
sb-stocks/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── app/store.js             # Redux store
│   │   ├── components/
│   │   │   ├── layout/              # Navbar, Sidebar, Footer
│   │   │   ├── stocks/              # StockCard, StockTable, TradeModal
│   │   │   ├── portfolio/           # PortfolioSummary, HoldingsTable
│   │   │   └── common/              # Loader, Button, ProtectedRoute
│   │   ├── features/                # Redux slices (auth, stocks, portfolio, transactions)
│   │   ├── pages/                   # Login, Register, Dashboard, Stocks, Portfolio, AdminPanel
│   │   ├── routes/AppRoutes.jsx     # Route configuration
│   │   └── services/axiosInstance.js # Centralized API client
│   └── vite.config.js
│
├── server/                          # Express Backend
│   ├── config/db.js                 # MongoDB connection
│   ├── controllers/                 # Auth, Stock, Portfolio, Transaction, Admin
│   ├── middleware/                   # Auth, Role, Error handling
│   ├── models/                      # User, Stock, Portfolio, Transaction, Watchlist
│   ├── routes/                      # API route definitions
│   ├── services/                    # Business logic (stock, transaction)
│   ├── utils/                       # Token generation, validators
│   ├── app.js                       # Express app configuration
│   ├── server.js                    # Entry point
│   └── seed.js                      # Database seeder
│
├── package.json                     # Root with concurrent scripts
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd SB_Stock
```

### 2. Install dependencies
```bash
# Install root, server, and client dependencies
npm run install-all
```

### 3. Configure environment variables
Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sb_stocks
JWT_SECRET=your_super_secure_secret
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Seed the database
```bash
cd server
npm run seed
```
This creates 20 US stocks and an admin account:
- **Admin Email:** admin@sbstocks.com
- **Admin Password:** admin123

### 5. Run the application
```bash
# From root directory - runs both server and client
npm run dev
```
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |

### Stocks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/stocks` | Get all stocks | Public |
| GET | `/api/stocks/:id` | Get single stock | Public |
| GET | `/api/stocks/sectors` | Get all sectors | Public |
| POST | `/api/stocks` | Create stock | Admin |
| PUT | `/api/stocks/:id` | Update stock | Admin |
| DELETE | `/api/stocks/:id` | Delete stock | Admin |

### Trading
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/transactions/buy` | Buy stock | Private |
| POST | `/api/transactions/sell` | Sell stock | Private |
| GET | `/api/transactions` | Get transaction history | Private |

### Portfolio
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/portfolio` | Get user portfolio | Private |

### Watchlist
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/watchlist` | Get watchlist | Private |
| POST | `/api/watchlist/add` | Add to watchlist | Private |
| DELETE | `/api/watchlist/remove/:id` | Remove from watchlist | Private |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/stats` | Get platform stats | Admin |

## 🔒 Security

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT stored in **HTTP-only cookies**
- **Helmet.js** for secure HTTP headers
- **CORS** configured for client origin only
- **Rate limiting** on auth routes (15 req/15 min)
- **express-mongo-sanitize** to prevent NoSQL injection
- **express-validator** for input validation

## 🔮 Future Improvements

- Real-time stock price updates via WebSocket
- Stock watchlist on dashboard
- Advanced charting with candlestick charts
- Portfolio performance history graph
- Social trading / leaderboard
- Email notifications for price alerts
- Mobile responsive enhancements
- Unit and integration tests
