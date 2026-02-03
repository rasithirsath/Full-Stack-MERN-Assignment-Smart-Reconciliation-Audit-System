import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup"; // ✅
import Layout from "./layout/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Reconciliation from "./pages/Reconciliation";
import Audit from "./pages/Audit";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* ✅ HERE */}
        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="reconciliation" element={<Reconciliation />} />
          <Route path="audit" element={<div>Select a record</div>} />
          <Route path="audit/:recordId" element={<Audit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
