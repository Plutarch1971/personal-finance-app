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
    <div className="container-fluid vh-100 d-flex flex-column login-pg-background">
      <div className="text-center pt-5 mt-4">
          <h1 className="text-white display-4 fw-bold">My Personal Finance</h1>          
      </div>
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <div className="row w-100 justify-content-center g-4 align-items-stretch">
                <div className="col-12 col-md-4 col-lg-3">
                      <div className="card p-4 shadow" style={{ height: "420px"}}>
                          <div className="card-body overflow-auto">
                                <p> Add text here</p>
                                <p> Add text here</p>
                                <p> Add text here</p>
                                <p> Add text here</p>
                                <p> Add text here</p>
                                <p> Add text here</p>
                                <p> Add text here</p>
                          </div>
                      </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3">
                      <div className="card p-4 shadow" style={{ height: "420px"}}>
                          <div className="card-body overflow-auto">
                            <p> Add text here</p>
                            <p> Add text here</p>
                            <p> Add text here</p>
                            <p> Add text here</p>
                            <p> Add text here</p>
                            <p> Add text here</p>
                            <p> Add text here</p>
                          </div>
                      </div>
                </div>
                    <div className="col-12 col-md-4 col-lg-3">  
                        <div className="card p-4 shadow" style={{ height: "420px"}}>
                          <div className="card-body">
                            <h3 className="card-title text-center">Login</h3>

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
