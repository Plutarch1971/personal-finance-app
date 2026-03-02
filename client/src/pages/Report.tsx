import { useState } from 'react';
import ExpensesByCategoryCard from '../components/ExpensesByCategoryCard';
import MonthlySummaryCard from '../components/MonthlySummaryCard';
import PieChartReport from '../components/PiechartReport';
import AccountTable from '../components/AccountTable';
import { useNavigate } from 'react-router-dom';


export default function Report(){
    const [ activeView, setActiveView ] = useState<'summary' | 'table' | 'chart' |'account'| null>(null);
    const navigate = useNavigate();

     return (
        <div className="container-fluid report-background w-100 vh-100" >
            <div className="row mt-5">
                <div className="col-12">
                    <h1 className="text-center"><strong>Welcome to Reporting</strong></h1>
                    <button className="btn btn-primary text-white" style={{ position: 'fixed', top: '50px', right: '70px' }} 
                        onClick={() => navigate('/dashboard')}
                    >
                        <strong>Dashboard</strong>
                    </button>
                </div>
                
            </div>
            {/* {error && <div className="alert alert-danger">{error}</div>}  */}
            <div className="row">
                <div className="col-2 p-4 mt-4">
                    <div className="d-grid gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={() => setActiveView('summary')}
                        >
                            Monthly Summary
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setActiveView('table')}
                        >
                            Expenses By Category
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setActiveView('chart')}
                        >
                            Expenses Pie Chart
                        </button>
                        <button className="btn btn-primary"
                                onClick={() => setActiveView('account')}
                        >
                            Account Balance
                        </button>
                    </div>
                </div>
        
                { /** Main Content Area */}
                <div className="col-10 ps-0 pe-4 pb-4">
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
                </div> {/** Row closes here now */}
            </div>
     )
}