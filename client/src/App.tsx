import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';
import Report from './pages/Report';
import ProtectedRoute from './components/ProtectedRoute';
import EditTransaction from './pages/EditTransaction';
import CategoryManager  from './pages/CategoryManager';
import AddCategory from './components/AddCategory';
import BudgetPage from './pages/BudgetPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
  <AuthProvider>
    <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
      <Route path="/" element={<Login/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />


      <Route path="/report" element={
        <ProtectedRoute>
          <Report/>
        </ProtectedRoute>
      } />
        
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route 
        path="/transactions/new"  
        element={
          <ProtectedRoute>
            <AddTransaction />
          </ProtectedRoute>
        } />
      {/**To add a new transaction */}
      <Route 
        path="/transactions" 
        element={
        <ProtectedRoute>
        <Transactions />
        </ProtectedRoute>
      } />
      {/* To view all the transactions*/}
      <Route
        path="transactions/:id/edit"
        element={
          <ProtectedRoute>
            <EditTransaction />
          </ProtectedRoute>
        } 
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoryManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
         <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/add-category"
          element={
            <ProtectedRoute>
              <AddCategory onClose={() => window.history.back()} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <BudgetPage />
            </ProtectedRoute>
          }
        />
        
     </Route>
    </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App;
