import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            <div className="container mb-4"style={{width:'30rem'}}>
                <h2>Registration Form</h2>
                 {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Enter username:</label>
                        <input type={username}
                        className="form-control"
                        value={username} 
                        onChange={e =>setUsername(e.target.value)}/>
                    </div>
                    
                    <div>
                        <label className="form-lable">Enter email</label>
                        <input type={email} 
                        className="form-control"
                        value={email} 
                        onChange={e => setEmail(e.target.value)}/>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Enter password</label>
                        <input type="password" 
                        className="form-control"
                        value={password} 
                        onChange={e => setPassword(e.target.value)}/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm password</label>
                        <input type="password" 
                        className="form-control"
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)}/>
                    </div>
                
               
                <button className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Creating account....': 'Register'}
                </button>
                 </form>
                </div>
            
        );
   
}