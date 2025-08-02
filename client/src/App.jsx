import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import TransactionsPage from "./pages/Transactions"; 
import Navbar from "./components/Navbar";
import BudgetingPage from "./pages/BudgetingPage";
import IncomePage from "./pages/IncomePage";
import Agent from "./pages/Agent";
import { LoadingProvider } from "./context/LoadingContext";
import "./App.css";

function App() {
  return (
    <LoadingProvider>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgeting" element={<BudgetingPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/agent" element={<Agent />} />
        </Routes>
      </div>
    </LoadingProvider>
  );
}

export default App;
