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

                await api.post('/users/register', {
                    username,
                    email, 
                    password
                });
                navigate('/login');
            }
            catch( err: any){
                setError(err.response?.data.error || 'Registration failed');
            }finally{
                setLoading(false);
            }
            


        }
        return (
            <div className="container-fluid vh-100 pt-5"> 
            <div className="row h-100"> 

                 {/**Left 2/3 Section */}
                 <div className="col-md-8 d-none d-md-flex flex-column justify-content-center align-items-center">
                    <p className="script-text text-white">Welcome to</p>
                    <p className="script-heading text-white"> Personal Finance App</p>
                    <p className="script-text text-white">Registration Page</p>
                     {/** Optioinal content here (image / branding /ect) */}
                    </div>
                     {/** Right 1/3 section */}
                     <div className="col-12 col-md-4 d-flex justify-content-center align-items-center">
                    <div className="container bg-card mb-4 p-5 rounded-4"style={{width:'30rem'}}>
                        <h2 className="text-center mb-4">Registration Form</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fs-4">Enter username:</label>
                                <input type={username}
                                className="form-control"
                                value={username} 
                                onChange={e =>setUsername(e.target.value)}/>
                            </div>
                            
                            <div>
                                <label className="form-lable fs-4">Enter email</label>
                                <input type={email} 
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