import React, { useEffect, useState } from 'react';
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
    type: 'income' | 'expense';
    parentId?: string | null;
}
 type TransactionType = 'income' | 'expense';

export default function AddTransaction(){
     
     // ------------state-----------------
    
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [transactionType, setTransactionType] = useState<TransactionType | ''>('');
    

    const [accountId, setAccountId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();
    
    
/*---------------load data---------------------------*/ 
   useEffect(() => {
        async function load(){
            try {
                const [accountsRes, categoriesRes] = await Promise.all([
                    api.get('/accounts'),
                    api.get('/categories'),
                ])
                setAccounts(accountsRes.data); // Updates acconts state
                setCategories(categoriesRes.data);
                console.log('FULL RESPONSE from /categories:', categoriesRes.data);
                console.log('Income categories found:', categoriesRes.data.filter((c: Category) => c.type === 'income'));
            } catch (err){
            console.error('Failed to load data', err);
            } finally {
            setLoading(false);
            }    
        }
        load();
    },[]);

    // Group + filter categories
    const filteredCategories = categories.filter((c) => c.type === transactionType
    );

    console.log('Transaction Type:', transactionType);
    console.log('All Categories:', categories);
    console.log('Filtered Categories:', filteredCategories);

    /**?------------------submit-------------------- */
    const handleSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!transactionType || !accountId || !amount || !transactionDate) {
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

    /*------------------- render -------------------------*/ 
    if (loading) {
        return <div className="container mt-5">Loading...
        </div>
    }
console.log('ALL income categories:', 
  categories.filter(c => c.type === 'income')
);

    return(
        <div className="container mt-4">
            <h2>Add Transaction</h2>
            <form onSubmit={handleSubmit}>
  {/*--------------------Select Transaction Type----------- */}
            <div className="mb-3">
                <label className="form-label">Transaction Type</label>
                <select 
                   className="form-select"
                   value={transactionType}
                   onChange={(e) => {
                    setTransactionType(e.target.value as TransactionType);
                    setCategoryId('');
                   }}
                   >
                    <option value="">Select type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                   </select>
            </div>

  {/*--------------------Account Rendering--------------------------- */}
                <div className="mb-3">
                    <label className="form-label">Account</label>
                    <select
                        className="form-select"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        >
                            <option value="">Select an account</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                </div>
                {/*-----------------------category-----------------*/}
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            disabled={!transactionType}
                    >
                        <option value="">
                            {transactionType 
                            ? 'Select category' 
                            : 'Select transaction type first'}
                        </option>
                        {filteredCategories.map((c) => 
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                        )}
                    </select>
                </div>

                {/*-------------------------amount----------------------- */}
                
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

                {/*-----------------------Date-------------------------------*/}
                <div className="mb-3">
                    <label className="form-label">Transaction Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        />
                </div>

                {/*------------------------Description------------------------- */}
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
                disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Transaction'}
                </button>
                
            </form>
        </div>
    );
}
