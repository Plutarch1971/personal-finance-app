import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import InstallButton from '../components/InstallButton';

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
    <div className="container-fluid d-flex flex-column">
      <div className="text-center py-5 mt-4 login-header">
          <h1 className="text-warning display-5 fw-bold mb-2 login-title">SmartBooksFinance</h1> 
          <h2 className="fs-5 text-center text-white mb-0 login-subtitle"> What can you do with this app</h2>        
      </div>
      <div className="flex-grow-1 d-flex align-items-start p-4">       
            <div className="row w-100 justify-content-center g-4 g-lg-5 align-items-stretch">
                <div className="col-12 col-md-3">
                      <div className="card h-100 border-0 shadow-sm rounded-4 login-card bg-card">
                          <div className="card-body p-3 p-lg-4 d-flex flex-column">
                            <h3 className="fw-bold fs-4 mb-3 text-center text-primary login-card-title">
                              📊 Track your expenses
                            </h3>
                            <img src="donutchart.png" className="mb-2" alt="piechart.png" />
                            <p className="text-muted fw-semibold mb-3 login-card-text">
                              Build better money habits with a clear view of your daily spending.
                            </p>
                          </div>
                      </div>
                </div>
                <div className="col-12 col-md-3">
                      <div className="card h-100 border-0 shadow-sm rounded-4 login-card bg-card">
                          <div className="card-body p-3 p-lg-4 d-flex flex-column">
                           <h4 className="fw-bold fs-4 text-center text-primary login-card-title mb-3">
                            📈 Monitor your Finances</h4>
                            <img src="multiplelinechart.png" alt="multiplelinechart.png" className="mb-2" />
                              <p className="text-muted fw-semibold mb-3 login-card-text">
                                Understand how your money moves with visual and time-based insights.
                              </p>
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
                              <div className="text-center mt-3 d-flex justify-content-between flex-wrap">
                                      <p className="mb-3"> Don’t have an account?{' '}</p>
                                      <Link to="/register">Register</Link>
                                      <InstallButton />
                              </div>
                          </div>
                        </div>
                      </div>
                  
                    </div>
              </div>
       
    </div>

  );
} 
