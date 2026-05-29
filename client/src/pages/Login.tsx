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
    <div className="container-fluid">

         {/* ===== HEADER SECTION ======= */}
          <div className="login-header mt-4">
            <img src="pwa-192.webp" alt="smarbooks-logo" className="logo-sm"/>
            <h1 className="text-warning display-5 fw-bold mb-0 login-title">SmartBooksFinance</h1> 
          </div>

          {/* ======  LANDING GRID STARTS =========*/}
        <div className="landing-grid">

          {/* ===========  LEFT PANEL ============= */}
            <div className="left-panel">
              <div className="dashboard-card mb-4">
                <p>Under construction</p>
              </div>
            </div>

              {/* ============ CENTER PANE============= */}
            <div className="center-panel">
                    <div className="dashboard-grid">
                          <div>
                            <div className="dashboard-card h-100">
                              <h5 className="text-primary fw-bold"> 📊 Track Expenses</h5>
                              <div className="image-wrapper">
                                <img src="expense-barchart.jpg" alt="expenses" className="feature-image" />
                              </div>
                              <p>Build better money habits with a clear view of your spending. </p>
                            </div>
                          </div>
                    
                          <div>
                              <div className="dashboard-card h-100">
                                <h5 className="text-primary fw-bold"> 📈 Financial Insight </h5>
                                <div className="image-wrapper">
                                  <img  src="income-donut.png" alt="income" className="feature-image"/>
                                </div>
                                <p>Understand how your money moves over time.</p>
                              </div>
                          </div>
                      
                            <div>
                                <div className="dashboard-card h-100">
                                  <h5 className="text-primary fw-bold"> 📈 Analytical</h5>
                                  <div className="image-wrapper">
                                    <div className="image-wrapper">
                                      <img src="expense-piechart.png" alt="expense-piechart" className="feature-image" />
                                    </div>
                                    <p>Track where money goes.</p>
                                  </div>
                                </div>
                            </div>
                    
                            <div>
                                <div className="dashboard-card h-100">
                                  <h5 className="text-primary fw-bold">📈 Reports</h5>
                                  <div className="image-wrapper">
                                   <img src="report-page.png" alt="report-page" className="feature-image"/>
                                  </div>
                                  <p>Reviewing Reports regularly can help make spending decisions.</p>
                                </div>
                            </div>

                            <div>
                                <div className="dashboard-card h-100">
                                  <h5 className="text-primary fw-bold">Card 5</h5>
                                  <div className="image-wrapper">
                                    <img src="" alt="" className="feature-image"/>
                                  </div>
                                  <p>Card 5</p>
                                </div>
                            </div>

                            <div>
                                <div className="dashboard-card h-100">
                                  <h5 className="text-primary fw-bold">Card 6</h5>
                                  <div className="image-wrapper">
                                    <img src="" alt="" className="feature-image"/>
                                  </div>
                                  <p>Card 6</p>
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
