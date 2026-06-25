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
            <div className="container-fluid d-flex flex-column h-100 overflow-hidden"> 
                <div className="text-center py-5 mt-4 login-header">
                    <h1 className="text-warning display-5 fw-bold mb-2 login-title">SmartBooksFinance</h1> 
                </div>
                <div className="row w-100 justify-content-center g-3 g-md-5 align-items-center flex-grow-1 px-2 px-md-4 pb-4"> 
                    <div className="col-12 col-lg-5 d-flex justify-content-center align-items-center">
                        <img src="/smartbooks-logo-bg-1024x500.webp" className="img-fluid mb-2" alt="expense-barchart" />
                    </div>

                    <div className="col-12 col-lg-5 d-flex justify-content-center align-items-center px-3 px-md-4">
                        <div className="container bg-card mb-4 p-4 p-md-5 rounded-4 w-100">
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
                    
        );
   
}