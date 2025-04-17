💸 Personal Finance Visualizer

A full-stack web application that helps users track transactions, set budgets per category, and visualize spending trends. This project was built as part of a full-stack internship assignment and includes interactive charts, real-time data visualization, and MongoDB integration.



---

## 🚀 Live Demo

- **Frontend (Vercel)**: [https://personal-finance-visualizer-sagarmaddelas-projects.vercel.app/](https://personal-finance-visualizer-sagarmaddelas-projects.vercel.app/)
- **Backend (Render)**: [https://personal-finance-visualizer-api.onrender.com](https://personal-finance-visualizer-api.onrender.com)


---

📌 Features

🔹 Dashboard Page

🥧 Category-wise Pie Chart

🢾 Most Recent 5 Transactions

💸 Total Expenses (for the current month)

🔹 Transactions Page
📊 Expense Line Chart

➕ Add new transactions

📃 View all transactions

🔹 Budgeting Page

📂 View and edit budgets by category

📈 Compare actual spending vs. budget

💡 Insights on Overspending and Savings

![alt screenshot-stage-1](image.png)

![alt screenshot-stage-1](image.png)

![alt screenshot-stage-1](image.png)
---

## 💠 Tech Stack

**Frontend:**
- React (Vite)
- Recharts
- CSS Modules / Custom CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- CORS

---

## 🧑‍💻 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/SagarMaddela/Personal-Finance-Visualizer.git
cd personal-finance-visualizer
```

### 2. Backend Setup

```bash
cd backend
npm init -y
npm install express mongoose cors dotenv
# Create .env file with:
# MONGO_URI = your_mongo_connection_string
npm run dev
```

### 3. Frontend Setup

```bash
cd ../clien
npm install
npm install recharts axios react-router-dom
npm run dev
```

---

## 📂 Folder Structure

```
YardStick/
├─ backend/
│  ├─ models/
│  │  ├─ Budget.js
│  │  └─ Transaction.js
│  ├─ routes/
│  │  ├─ budjets.js
│  │  └─ transactions.js
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  └─ server.js
├─ client/
│  ├─ public/
│  │  └─ vite.svg
│  ├─ src/
│  │  ├─ assets/
│  │  │  └─ react.svg
│  │  ├─ components/
│  │  │  ├─ ExpenseChart.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ PieChart.jsx
│  │  │  ├─ TransactionForm.jsx
│  │  │  └─ TransactionList.jsx
│  │  ├─ pages/
│  │  │  ├─ BudgetingPage.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  └─ Home.jsx
│  │  ├─ styles/
│  │  │  ├─ budget.css
│  │  │  ├─ chart.css
│  │  │  ├─ dashboard.css
│  │  │  ├─ form.css
│  │  │  ├─ list.css
│  │  │  └─ navbar.css
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ .gitignore
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  └─ vite.config.js
├─ .gitignore
├─ image.png
├─ LICENSE
└─ README.md

```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
