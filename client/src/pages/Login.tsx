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
    <div className="container-fluid vh-100 d-flex flex-column">
      <div className="text-center py-5 mt-4">
          <h1 className="text-white display-3 fw-bold mb-3">My Personal Finance</h1> 
          <h2 className="fs-2 text-center text-white h4 mt-4 mb-0"> What can you do with this app</h2>        
      </div>
      <div className="flex-grow-1 d-flex align-items-start pt-4">       
            <div className="row w-100 justify-content-center g-4 align-items-stretch">
                <div className="col-12 col-md-4 col-lg-3">
                      <div className="card h-100 rounded-4" 
                            style={{ boxShadow:"0 10px 25px rgba(0,0,0,0.15"}}
                      >
                          <div className="card-body p-4 d-flex flex-column">
                            <h5 className="fw-bold mb-3 text-primary">
                              Track your expenses
                            </h5>
                            <p className="text-muted mb-3">
                              Build better money habits with a clear view of your daily spending.
                            </p>
                            <ul className="list-unstyled ps-3 small text-muted">
                              <li>Track monthly income and expenses</li>
                              <li>Analyze spending habits</li>
                              <li>View category-based expense breakdown</li>
                              <li>Monitor account balances</li>
                            </ul>
                          </div>
                      </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3">
                      <div className="card h-100 border-0 shadow-lg rounded-4">
                          <div className="card-body p-4 d-flex flex-column">
                            <h5 className="fw-bold mb-3 text-primary">Keep Track of your Investments</h5>
                              <p className="text-muted mb-3">
                                Understand how your money moves with visual and time-based insights.
                              </p>
                            <ul className="list-unstyled ps-3 small text-muted">
                              <li>Visualize financial trends</li>
                              <li>Compare spending across time periods</li>
                              <li>Manage multiple financial accounts</li>
                              <li>Track last 30-day spending behavior</li>
                            </ul>
                          </div>
                      </div>
                </div>
                    <div className="col-12 col-md-4 col-lg-3">  
                        <div className="card h-100 border-0 shadow-lg rounded-4">
                          <div className="card-body p-4 d-flex flex-column">
                            <h3 className="fw-bold mb-4 text-center text-primary">Login</h3>

                            {error && (
                              <div className="alert alert-danger">{error}</div>
                            )}

                            <form className="form-control form-control-lg"
                                  onSubmit={handleSubmit}>
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
                                className="btn btn-primary btn-lg w-100"
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
