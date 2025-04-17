import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import TransactionsPage from "./pages/Home"; 
import Navbar from "./components/NavBar";
import BudgetingPage from "./pages/BudgetingPage";
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
        </Routes>
      </div>
    </>
  );
}

export default App;
