import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
// import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
  <AuthProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/login" element={<Login/>} />
      {/* <Route path="/register" element={<Register/>} /> */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
      />
      <Route 
        path="/transactions/new"  
        element={
        <ProtectedRoute>
          <AddTransaction />
        </ProtectedRoute>
      }
      />
      {/**To add a new transaction */}
      <Route
        path="/transactions" 
        element={
        <ProtectedRoute>
        <Transactions />
        </ProtectedRoute>
      }
      />
      {/* To view all the transactions*/}
    </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App;