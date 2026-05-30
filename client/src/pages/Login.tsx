import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import InstallButton from '../components/InstallButton';
import '../Landing.css';

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (auth?.login){
      auth.login(res.data.token);
      navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">

         {/* ===== HEADER SECTION ======= */}
          <div className="login-header mt-4">
            <img src="pwa-192.webp" alt="smarbooks-logo" className="logo-sm"/>
            <h1 className="text-warning display-5 fw-bold mb-0 login-title">SmartBooksFinance</h1> 
          </div>

          {/* ======  LANDING GRID STARTS =========*/}
        <div className="landing-grid">

          {/* ===========  LEFT PANEL ============= */}
            <div className="left-panel">
              <div className="text-white">
                <h5 className="text-white fw-bold">Overview</h5>
                  {/* <div className="image-wrapper">
                    <img src="add-transaction.png" alt="transaction-page" className="feature-image" />
                  </div> */}
                  <ul>
                  <li><p>Create expenses, income and transfers</p></li>
                  <li><p>Upload receipts using file or camera</p></li>
                  </ul>
              </div>
            </div>

              {/* ============ CENTER PANEL ============= */}
            <div className="center-panel">
                    <div className="dashboard-grid">
                          <div>
                            <div className="dashboard-card h-100">
                              <h5 className="text-primary fw-bold text-center"> 📊 Track Expenses</h5>
                              <div className="image-wrapper">
                                <img src="expense-barchart.jpg" alt="expenses" className="feature-image" />
                              </div>
                              <p>Build better money habits with a clear view of your spending. </p>
                            </div>
                          </div>
                    
                          <div>
                              <div className="dashboard-card h-100">
                                <h5 className="text-primary fw-bold text-center">Income donut</h5>
                                <div className="image-wrapper">
                                  <img  src="income-donut.png" alt="income" className="chart-image"/>
                                </div>
                                <p>Monitor your income from various sources</p>
                              </div>
                          </div>
                      
                            <div>
                                <div className="dashboard-card h-100">
                                  <h5 className="text-primary fw-bold text-center"> View expenses by percentage</h5>
                                  <div className="image-wrapper">
                                      <img src="expense-piechart.png" alt="expense-piechart" className="chart-image" />  
                                  </div>
                                  <p>Track where money goes.</p>
                                </div>
                            </div>
                    
                            <div>
                                <div className="dashboard-card h-100">
                                  <h5 className="text-primary fw-bold text-center">📈 Reports</h5>
                                  <div className="image-wrapper">
                                   <img src="report-page.png" alt="report-page" className="feature-image"/>
                                  </div>
                                  <p>Analyze your finances using various Reports</p>
                                </div>
                            </div>

                            <div>
                                <div className="dashboard-card h-100">
                                  <h5 className="text-primary fw-bold text-center">Dashboard</h5>
                                  <div className="image-wrapper">
                                    <img src="dashboard.png" alt="dashboard" className="feature-image"/>
                                  </div>
                                  <p>View current monthly summaries and navigate quickly</p> 
                                </div>
                            </div>

                            <div>
                                <div className="dashboard-card h-100">
                                  <h5 className="text-primary fw-bold text-center">View Budget Features</h5>
                                  <div className="image-wrapper">
                                    <img src="budget-page.png" alt="budget-page" className="feature-image"/>
                                  </div>
                                  <p>Auto generate budget or make your own budget</p>
                                </div>
                            </div>
                  </div>
            </div>
                
          {/* ============ RIGHT PANEL =========== */}
                  <div className="right-panel text-white">  
                    
                        <h3 className="fw-bold mb-4 text-center">
                          Login
                        </h3>

                        {error && (
                          <div className="alert alert-danger">{error}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                              id="email"
                              type="email"
                              className="form-control"
                              value={email}
                              required
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                              type="password"
                              className="form-control"
                              value={password}
                              required
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                          >
                            {loading ? 'Logging in...' : 'Login'}
                          </button>
                        </form>
                          <div className="mt-4 text-center">
                              <p> Don’t have an account?</p>
                              <Link to="/register">Register</Link>
              
                              <div className="mt-3">
                              <InstallButton />
                              </div>
                          </div>
                  </div>                          
        </div>
    </div>

  );
} 
