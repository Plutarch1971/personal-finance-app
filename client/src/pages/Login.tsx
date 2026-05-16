import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

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
      const res = await api.post('/users/login', { email, password });
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
    <div className="container-fluid d-flex flex-column">
      <div className="text-center py-5 mt-4 login-header">
          <h1 className="text-warning display-5 fw-bold mb-2 login-title">SmartBooks</h1> 
          <h2 className="fs-5 text-center text-white mb-0 login-subtitle"> What can you do with this app</h2>        
      </div>
      <div className="flex-grow-1 d-flex align-items-start p-4">       
            <div className="row w-100 justify-content-center g-4 g-lg-5 align-items-stretch">
                <div className="col-12 col-md-3">
                      <div className="card h-100 border-0 shadow-sm rounded-4 login-card bg-card">
                          <div className="card-body p-3 p-lg-4 d-flex flex-column">
                            <h4 className="fw-bold fs-4 mb-3 text-center text-primary login-card-title">
                              📊 Track your expenses
                            </h4>
                            <p className="text-muted fw-semibold mb-3 login-card-text">
                              Build better money habits with a clear view of your daily spending.
                            </p>
                            <ul className="list ps-3 text-success fw-normal login-card-list">
                              <li>Track monthly income and expenses</li>
                              <li>Analyze spending habits</li>
                              <li>View category-based expense breakdown</li>
                              <li>Monitor account balances</li>
                              <li>Add or remove categories to adjust your personal or small business needs</li>
                            </ul>
                          </div>
                      </div>
                </div>
                <div className="col-12 col-md-3">
                      <div className="card h-100 border-0 shadow-sm rounded-4 login-card bg-card">
                          <div className="card-body p-3 p-lg-4 d-flex flex-column">
                           <h4 className="fw-bold fs-4 mb-3 text-center text-primary login-card-title">📈 Monitor your Finances</h4>
                              <p className="text-muted fw-semibold mb-3 login-card-text">
                                Understand how your money moves with visual and time-based insights.
                              </p>
                            <ul className="list ps-3 text-success fw-normal login-card-list">
                              <li>Follow your Investments</li>
                              <li>Visualize financial trends</li>
                              <li>Compare spending across time periods</li>
                              <li>Manage multiple financial accounts</li>
                              <li>Track last 30-day spending behavior</li>
                            </ul>
                          </div>
                      </div>
                </div>
                    <div className="col-12 col-md-3">  
                        <div className="card h-100 border-0 shadow-sm rounded-4 login-card bg-card">
                          <div className="card-body p-3 p-lg-4 d-flex flex-column">
                            <h3 className="fw-bold mb-4 fs-4 text-center text-primary login-card-title">Login</h3>

                            {error && (
                              <div className="alert alert-danger">{error}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                              <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
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
                              <div className="text-center mt-3">
                              <small>
                                Don’t have an account?{' '}
                                <Link to="/register">Register</Link>
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                  
                    </div>
              </div>
       
    </div>

  );
} 
