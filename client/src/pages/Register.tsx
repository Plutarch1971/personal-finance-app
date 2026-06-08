import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register(){

    const [username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword] = useState('');
    const [loading , setLoading] = useState(false);
    const [ error, setError ] = useState('');

    const navigate = useNavigate();
        
       
        const handleSubmit = async (e:React.SyntheticEvent) => {
            e.preventDefault();
            setError('');
            
            if(!username || !email || !password) {
                setError( "Please fill out all required fields with valid information");
                return
            }
            if ( password.length < 6){
                setError("password must be at least 6 character long");
                return;
            }
            if (confirmPassword !== password){
                setError("Your password do not match");
                return;
            }

            try {
                setLoading(true);

                await api.post('/auth/register', {
                    username,
                    email, 
                    password
                });
                navigate('/login');
            }
            catch( err: any){
                setError(
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    `Registration failed${err.response?.status ? ` (${err.response.status})` : ''}`
                );
            }finally{
                setLoading(false);
            }
            


        }
        return (
            <div className="container-fluid d-flex flex-column"> 
                <div className="text-center py-5 mt-4 login-header">
                    <h1 className="text-warning display-5 fw-bold mb-2 login-title">SmartBooksFinance</h1> 
                    <h2 className="fs-5 text-center text-white mb-0 login-subtitle"> What can you do with this app</h2>        
                </div>
            <div className="flex-grow-1 d-flex align-items-start p-4">
                <div className="row w-100 justify-content-center g-4 g-lg-5 align-items-stretch"> 
                     {/**Left 1/3 Section */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="card h-100 border-0 shadow-sm rounded-4 login-card bg-card">
                          <div className="card-body p-3 p-lg-4 d-flex flex-column">
                            <h3 className="fw-bold fs-4 mb-3 text-center text-primary login-card-title">
                              📊 Track your expenses
                            </h3>
                            <img src="/expense-piechart.png" className="mb-2" alt="expense-barchart" />
                            <p className="text-muted fw-semibold mb-3 login-card-text">
                              Build better money habits with a clear view of your daily spending.
                            </p>
                          </div>
                      </div>
                </div>
                 {/**Left 2/3 Section */}
                <div className="col-12 col-md-6 col-lg-3">
                      <div className="card h-100 border-0 shadow-sm rounded-4 login-card bg-card">
                          <div className="card-body p-3 p-lg-4 d-flex flex-column">
                           <h4 className="fw-bold fs-4 text-center text-primary login-card-title mb-3">
                            📈 Monitor your Finances</h4>
                            <img src="/add-transaction-page.png" alt="income-donut" className="img-fluid mb-2" style={{height: "500px"}} />
                              <p className="text-muted fw-semibold mb-3 login-card-text">
                                Understand how your money moves with visual and time-based insights.
                              </p>
                          </div>
                      </div>
                </div>
                 
                     {/** Right 1/3 section */}
                     <div className="col-12 col-md-3 d-flex justify-content-center align-items-center">
                    <div className="container bg-card mb-4 p-5 rounded-4"style={{width:'30rem'}}>
                        <h2 className="text-center mb-4">Registration Form</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fs-4">Enter username:</label>
                                <input type="text"
                                className="form-control"
                                value={username} 
                                onChange={e =>setUsername(e.target.value)}/>
                            </div>
                            
                            <div>
                                <label className="form-lable fs-4">Enter email</label>
                                <input type="email" 
                                className="form-control"
                                value={email} 
                                onChange={e => setEmail(e.target.value)}/>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fs-4">Enter password</label>
                                <input type="password" 
                                className="form-control"
                                value={password} 
                                onChange={e => setPassword(e.target.value)}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fs-4">Confirm password</label>
                                <input type="password" 
                                className="form-control"
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)}/>
                            </div>
                        
                    
                        <button className="btn btn-primary w-100 fs-4 fw-semibold" disabled={loading}>
                            {loading ? 'Creating account....': 'Register'}
                        </button>
                        </form>
                        <p className="pt-4 fs-4">
                            Already registered? Go to {" "} 
                            <Link to="/login">Login page</Link>
                        </p>
                        </div>
                    </div>
                   </div>
                   </div>
                  </div>
                    
        );
   
}