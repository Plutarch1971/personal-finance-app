import { useState } from 'react';
import api from '../api/axios';


interface ExpenseCategory{
    categoryName: string;
    totalExpense: number;
    
}
interface ExpenseCategoryAPI {
    "category.name": string;
    total:string;
}

export default function ExpensesByCategoryCar (){

    const [ startDate, setStartDate ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const [ expenseByCategory, setExpenseByCategory] = useState<ExpenseCategory[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState('');
    

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
        
    <div className="col-10 mt-3">
            <div className="d-flex justify-content-center">
                <div style={{ width: '500px'}}>
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
                        {error && <div className="alert alert-danger">{error}</div>}
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
                </div>
            </div>
    )

}
