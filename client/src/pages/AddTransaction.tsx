import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
}
 interface Category {
    id: string;
    name: string;
    type: string;
}

export default function AddTransaction(){

     // Initial render: accounts = []
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [accountId, setAccountId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);


    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountId || !amount || Number(amount) <= 0|| !transactionDate) {
    alert('Please fill all required fields with valid values');
    return;
    }
    const payload = {
    accountId,
    categoryId: categoryId || null,
    amount: Number(amount),
    transactionDate,
    description: description || null,
    };

    try {
        setSaving(true);
        await api.post('/transactions', payload);
        navigate('/dashboard');
    } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to save transaction');
    } finally {
        setSaving(false);
    }

};


    useEffect(() => {
        async function load(){
            try {
                const accountsRes = await api.get('/accounts');
                const categoriesRes = await api.get('/categories');

                setAccounts(accountsRes.data); // Updates acconts state
                setCategories(categoriesRes.data);
            } catch (err){
            console.error('Failed to load data', err);
            } finally {
            setLoading(false);
            }    
        }
        load();
    },[]);
    if (loading) {
        return <div className="container mt-5">Loading...
        </div>
    }
    console.log('accounts:', accounts);
    console.log('categories:', categories);

    return(
        <div className="container mt-4">
            <h2>Add Transaction</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label className="form-label">Account</label>
                    <select
                        className="form-control"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        >
                            <option value="">Select an account</option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-control"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Select a Category</option>
                        {categories.map((category) =>(
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                </div>
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        step="0.01"
                        />
                </div>
                <div className="mb-3">
                    <label className="form-label">Transaction Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                </div>
                
                <button type="submit" 
                className="btn btn-primary"
                disabled={saving}>
                  {saving ? 'Saving...' : 'Save Transaction'}
                </button>
                
            </form>
        </div>
    );
}
