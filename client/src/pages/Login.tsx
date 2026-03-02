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
    <div className="container-fluid login-pg-background px-2 px-md-3 min-vh-100 py-4">
      <div className="container fluid"> 
              <div className="row mb-4 mt-2">
                <div className="col-12 text-center">
                <h1 className="text-white display-4 fw-bold">My Personal Finance</h1>
                </div>
              </div>
                  {/* <div className="container"> */}
                  <div className="row justify-content-center g-5 mx-0">
                      <div className="col-12 col-md-6 col-xl-4 px-1 d-md-flex justify-content-center"> {/** 2/3 of 12 col */}
                            <div className="card h-100 w-100" style={{ maxWidth: "500px", maxHeight: "500px"}}>
                                <div className="card-body">
                                    <p> Add text here</p>
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
                      <div className="col-12 col-md-6 col-xl-4 px-1 d-flex flex-row">
                        <div className="card h-100 w-100">
                          <div className="card-body">
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
                          <div className="col-12 col-md-6 col-xl-4 px-1 d-flex justify-content-center align-self-center">  
                              <div className="card shadow h-100 w-100">
                                <div className="card-body bg-light">
                                  <h3 className="card-title text-center mb-4">Login</h3>

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
              {/* </div> */}
         </div> 
    </div>

  );
} 
