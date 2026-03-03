# Personal Finance Management App
A full-stack Personal Finance application that allows users to track income, expenses, accounts, and generate financial reports with interactive charts.
Built using React + TypeScript + Node.js + Express + Sequelize + PostgreSQL + Recharts.
 
## 🚀 Features
🔐 Authentication
•	User registration
•	Secure login with JWT authentication
•	Protected routes
•	Logout functionality
 
## 💳 Account Management
•	Create multiple financial accounts (e.g., Checking, Savings)
•	View account balances
•	Real-time balance updates after transactions
 
## 🧾 Transaction Management
•	Add income or expense transactions
•	Edit existing transactions
•	Delete transactions
•	Filter by transaction type (income / expense)
•	Assign transactions to categories
•	Automatic balance updates
 
## 🗂 Category Management
•	Income and Expense categories
•	Hierarchical categories (parent / child support)
•	Normalized database structure
•	Unique constraints to prevent duplicates
 
## 📊 Financial Reports
Interactive and visual financial insights using Recharts:
### ✅ Monthly Summary
•	Total Income
•	Total Expenses
•	Net Balance
### 📈 Expense by Category
•	Pie Chart visualization
•	Bar Chart comparison
•	Last 30-day expense breakdown
### 💹 Investment Visualization
•	Line chart for growth over time
•	Radar chart for allocation
•	Category-based distribution
### 🏦 Account Balances
•	View balances across accounts
 
### 📱 Responsive Design
•	Mobile-friendly layout
•	Optimized Bootstrap grid usage
•	Responsive charts using ResponsiveContainer
•	Proper button stacking behavior on small screens
 
### 🛠 Tech Stack
#### Frontend
•	React
•	TypeScript
•	React Router
•	Axios
•	Bootstrap 5
•	Recharts (data visualization)
#### Backend
•	Node.js
•	Express
•	TypeScript
•	Sequelize ORM
•	PostgreSQL
•	JWT Authentication
 
## 🗄 Database Design
### Core Tables
•	Users
•	Accounts
•	Transactions
•	Categories
### Relationships
•	User → hasMany Accounts
•	User → hasMany Transactions
•	User → hasMany Categories
•	Account → hasMany Transactions
•	Transaction → belongsTo Category
•	Category → hierarchical (parentId support)
 
## 📈 Sample Use Cases
With this app, a user can:
•	Track monthly income and expenses
•	Analyze spending habits
•	View category-based expense breakdown
•	Monitor account balances
•	Visualize financial trends
•	Compare spending across time periods
•	Manage multiple financial accounts
•	Track last 30-day spending behavior
 
## 🔒 Security Features
•	JWT-based authentication
•	Protected backend routes
•	User-scoped data (multi-user support)
•	Unique index constraints for category normalization
•	Controlled API responses using attributes
 
## 🧠 Architecture Overview
Routes → Controllers → Services → Models → Database
•	Controllers handle HTTP logic
•	Services handle business logic
•	Sequelize handles database interactions
 
## 🖥 Installation
**1️⃣ Clone Repository**
git clone https://github.com/your-username/personal-finance-app.git
cd personal-finance-app
 
**2️⃣ Backend Setup**
cd server
npm install
Create .env file:
PORT=5000
DATABASE_URL=your_postgres_connection
JWT_SECRET=your_secret
Run:
npm run dev
 
**3️⃣ Frontend Setup**
cd client
npm install
npm run dev
 
## 📊 Future Improvements
•	Budget tracking system
•	Recurring transactions
•	Savings goal tracking
•	Net worth tracking
•	CSV export
•	Dark mode
•	Role-based admin features
•	Cloud deployment (Render / Railway / AWS)
 
## 📸 Screenshots
(You can add dashboard screenshots here)
 
## 👨‍💻 Author
Matthew Mendez
Full-Stack Developer
Built as a production-style finance management system.
 
## 📄 License
MIT License
 
## ⭐ Why This Project Is Strong
This project demonstrates:
•	Full-stack development
•	Authentication
•	Relational database design
•	Data aggregation
•	Chart visualization
•	Clean architecture
•	Responsive UI
•	Financial reporting logic
 

