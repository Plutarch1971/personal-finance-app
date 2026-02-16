import { useState } from 'react';
import api from '../api/axios';

import PieChartReport from '../components/PiechartReport';

interface monthlySummary {
    income: number;
    expense: number;
    net: number;
}
interface ExpenseCategory{
    categoryName: string;
    totalExpense: number;
    
}
interface ExpenseCategoryAPI {
    "category.name": string;
    total:string;
}

export default function Report(){
    const [monthlySummary, setMonthlySummary ] = useState<monthlySummary>({income: 0, expense: 0, net: 0});
    const [expenseByCategory, setExpenseByCategory ] = useState<ExpenseCategory[]>([]);
    //const [accountBalance, setAccountBalance ] = useState<any>([]);
    const [loading, setLoading ] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate ] = useState('');
    const [ error, setError ] = useState('');

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.get('/reports/summary', {
                params: { startDate, endDate }
            });
            setMonthlySummary(res.data);
            setError('');
        } catch (error) {
            setError('Error fetching monthly summary');
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        try{
            const expenseByCategoryRes = await api.get('/reports/expenses-by-category', {
                params: { startDate, endDate }
            
            });
            const data = expenseByCategoryRes.data.map((item: ExpenseCategoryAPI) =>({
                categoryName: item["category.name"],
                totalExpense: parseFloat(item.total)
        }));
            
            setExpenseByCategory(data);
            setError('');
        } catch (error) {
            setError('Error fetching expenses by category');
        } finally {
            setLoading(false);
        }
    };

     return (
        <div className="container-fluid  w-100 vh-100">
            <div className="row mt-5">
                <div className="col-12">
                    <h1 className="text-center"><strong>Financial Report</strong></h1>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                <div className="col-3 mt-5">
                <h3 className="text-center">Monthly Summary</h3>
                    <div className="card">
                        <div className="card-body">
                            <div className="card-title"><strong>Select a Month</strong></div>
                            <form onSubmit={handleSubmit}>
                                <label className="form-control">Enter start date:</label>
                                <input type="date"
                                value={startDate} onChange={(e) => setStartDate(e.target.value)} 
                                />
                                <label className="form-control">Enter end date:</label>
                                 <input className="form-control"
                                 type="date"
                                value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                />
                                <button className="btn btn-primary"
                                type="submit"> 
                                {loading ? 'Loading...' : 'Get Summary' }
                                </button>
                            </form>
                            <div className="card-body">
                                <p><strong>Income :</strong>${monthlySummary.income}</p>
                                <p><strong>Expense :</strong> ${monthlySummary.expense}</p>
                                <p><strong>Net :</strong> ${monthlySummary.net}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3 mt-5">
                    <h3 className="text-center">Expenses By Categories</h3>
                    <div className="card">
                        <div className="card-body">
                        <div className="card-title"><strong>Table Format</strong></div>
                    <form onSubmit={handleCategorySubmit}>
                        <label className="form-control">Select start date:</label>
                        <input type="date" 
                                value={startDate} 
                                className="form-control"
                                onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label className="form-control">Select end date:</label>
                        <input type="date"
                               className="form-control"
                               value={endDate}
                               onChange={(e) => setEndDate(e.target.value)}
                               />
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Category Name</th>
                                <th scope="col">Total Expense</th>
                            </tr>
                        </thead>
                        <tbody>
                           {expenseByCategory.map((item,index) => (
                            <tr key={index}>
                                <td>{item.categoryName}</td>
                                <td>${item.totalExpense}</td>
                            </tr>
                           ))} 
                           
                        </tbody>
                    </table>

                    <button className="btn btn-primary" type="submit">
                        { loading ? 'Loading...' : 'Get Expenses by Categories'}
                    </button>
                   
                    </form>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 mt-5">
                         <h3 className="text-center">Expenses By Categories</h3>
                        <div className="card">
                            <div className="card-body">
                        <div className="card-title"><strong>Pie Chart</strong></div>
                        <PieChartReport />
                        </div>
                    </div>
                    </div>

                </div>
            </div>
        
     )
    
}