import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import TransactionsPage from "./pages/Transactions"; 
import Navbar from "./components/Navbar";
import BudgetingPage from "./pages/BudgetingPage";
import IncomePage from "./pages/IncomePage";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgeting" element={<BudgetingPage />} />
          <Route path="/income" element={<IncomePage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
