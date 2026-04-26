import { useState } from 'react';
import ExpensesByCategoryCard from '../components/ExpensesByCategoryCard';
import MonthlySummaryCard from '../components/MonthlySummaryCard';
import PieChartReport from '../components/PiechartReport';
import AccountTable from '../components/AccountTable';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 


export default function Report(){
    const auth = useAuth();
      if (!auth) return null;
      const { logout } = auth;
    
    const [ activeView, setActiveView ] = useState<'summary' | 'table' | 'chart' |'account'| null>(null);
    const navigate = useNavigate();

     return (
        <div className="container-fluid report-background w-100 vh-100 pt-4">
                    <div className="row mt-5">
                        <div className="col-8 col-lg-12">
                            <div className="d-flex flex-row align-items-center w-100">
                            <button className="btn btn-outline-light ms-3" style={{ minWidth: 'auto'}}
                                onClick={() => navigate('/dashboard')}
                            >
                                <strong>Dashboard</strong>
                            </button>
                            <button className="btn btn-danger fw-bold ms-auto me-3" 
                                    style={{ minWidth: 'auto'}}
                                    onClick={logout}
                                    >
                                Logout
                            </button>
                            </div>
                        </div>
                        
                    </div>
            {/* {error && <div className="alert alert-danger">{error}</div>}  */}
                    <div className="row">
                                <div className="col-12 col-lg-2 p-3 mt-2">
                                    <div className="d-flex flex-column flex-wrap gap-2 justify-content-center justify-content-lg-start">
                                        <button
                                            className="btn btn-outline-light"
                                            onClick={() => setActiveView('summary')}
                                        >
                                            Monthly Summary
                                        </button>
                                        <button 
                                            className="btn btn-outline-light"
                                            onClick={() => setActiveView('table')}
                                        >
                                            Expenses By Category
                                        </button>
                                        <button
                                            className="btn btn-outline-light"
                                            onClick={() => setActiveView('chart')}
                                        >
                                            Expenses Pie Chart
                                        </button>
                                        <button className="btn btn-outline-light"
                                                onClick={() => setActiveView('account')}
                                        >
                                            Account Balance
                                        </button>
                                    </div>
                                </div>
                
                        { /** Main Content Area */}
                
                                <div className="col-12 col-lg-10 d-flex justify-content-center px-3 px-lg-4 pb-4">
                                    <div className="w-100" style={{ maxWidth: '1100px'}}>
                                    {activeView === 'summary' && (
                                        <MonthlySummaryCard onClose={() => setActiveView(null)}/>
                                    )}
                                    {activeView === 'table' && (  
                                        <ExpensesByCategoryCard onClose={() => setActiveView(null)} />  
                                    )}
                                    {activeView === 'chart' && ( 
                                        <PieChartReport onClose={() => setActiveView(null)}/>
                                    )}
                                    {activeView === 'account' && (
                                        <AccountTable onClose={() => setActiveView(null)}/>
                                    )}
                                    </div> 
                                {!activeView && (   
                                    <div className="col-12 col-lg-12">
                                        <div className="d-none d-md-flex flex-column justify-content-center align-items-center">
                                            <p className="script-text text-white">Welcome to</p>
                                            <p className="script-heading text-white"> Personal Finance App</p>
                                            <p className="script-text text-white">Report Page</p>
                                        </div>                      
                                    </div>
                                )}
                            </div>
                    </div> {/** Row closes here now */}
            </div>
     )
}
