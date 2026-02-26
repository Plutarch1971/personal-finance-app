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
 type Mode = 'create' |'edit';

 interface TransactionFormProps {
    mode: Mode;
    initialData?: {
        id?: string;
        accountId: string;
        categoryId: string;
        amount: number;
        description?: string | null;
        transactionDate: string;
    };
    onSubmit: (data: any) => Promise<void>;
 }

export default function TransactionForm({mode, initialData, onSubmit}: TransactionFormProps){
     
    const navigate = useNavigate();

     // ------------state-----------------
    
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    

    const [accountId, setAccountId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [description, setDescription] = useState('');
    const [transactionType, setTransactionType] = useState<TransactionType>('expense')
    
    
/*---------------LOAD ACCOUNTS + CATEGOIRES---------------------------*/ 
   useEffect(() => {
     async function loadData(){
            try {
            const [accountsRes, categoriesRes] = await Promise.all([
                api.get('/accounts'),
                api.get('/categories'),
            ]);
            setAccounts(accountsRes.data);
            setCategories(categoriesRes.data);
            } catch (err) {
                console.error('Failed to load form data', err);
            } finally {
                setLoading(false);
            }
        }
        
        loadData();
    },[]);

    /**-------------------------PREFILL EDIT MODE------------------------------ */
    useEffect(() => {
        if(initialData) {
            setAccountId(initialData.accountId);
            setCategoryId(initialData.categoryId);
            setAmount(Math.abs(initialData.amount).toString());
            setTransactionDate(initialData.transactionDate);
            setDescription(initialData.description || '');

            setTransactionType(
                initialData.amount >= 0 ? 'income' : 'expense'
            );

        }
    },[initialData]);



    // -----------------------FILTER CATEGORIES ------------------------------------
    const filteredCategories = categories.filter(
        (c) => c.type === transactionType
    );

    /**?------------------ SUBMIT -------------------- */
    const handleSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!accountId || !categoryId || !amount || !transactionDate) {
        alert('Please fill all required fields');
        return;
    }

    const finalAmount = 
                transactionType === 'expense'
                ? -Math.abs(Number(amount))
                : Math.abs(Number(amount));

    const payload = {
            accountId,
            categoryId: categoryId || null,
            amount: finalAmount,
            transactionDate,
            description: description || null,
            }
    try {
        setSaving(true);
        await onSubmit(payload);
        } finally {
            setSaving(false);
        }
    };       
        
    /** -------------------- LOADING -------------------------------- */
    // <button>
    //     {mode === 'create' ? 'Add Transaction' : 'Update Transaction'}
    // </button>
    
    if (loading) {
        return <div className="container mt-5">Loading...</div>
    }

    return(
        <>
        <div className="container mt-4">
            <div className="row d-flex justify-content-center">
                <div className="col-md-6 bg-light p-4 rounded shadow-sm">
                    <h2 className="text-center mb-4">
                        {mode === 'create'
                        ? 'Add Transaction'
                        : 'Edit Transaction'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                    {/*--- Transaction Tpye */}
                    <div className="mb-3">
                        <label className="form-label">
                            Transaction Type
                        </label>
                        <select 
                        className="form-select"
                        value={transactionType}
                        onChange={(e) => {
                            setTransactionType(
                                e.target.value as TransactionType
                            );
                            setCategoryId('');
                        }}
                        >
                            <option value="">Select type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

        {/*--------------------ACCOUNT RENDERING--------------------------- */}
                        <div className="mb-3">
                            <label className="form-label">Account</label>
                            <select
                                className="form-select"
                                value={accountId}
                                onChange={(
                                    e) => setAccountId(e.target.value)}
                                >
                                    <option value="">Select an account</option>
                                    {accounts.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                        </div>
                        {/*--------------------- CATEGORY -----------------*/}
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select className="form-select"
                                    value={categoryId}
                                    onChange={
                                        (e) => setCategoryId(e.target.value)
                                    }
                               //disabled={!transactionType}
                            >
                                <option value="">Select category</option>
                                {filteredCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                                ))}
                            </select>
                        </div>

                        {/*------------------------- AMOUNT ----------------------- */}
                        
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

                        {/*---------------------  DATE -------------------------------*/}
                        <div className="mb-3">
                            <label className="form-label">
                                Transaction Date
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                value={transactionDate}
                                onChange={(e) => setTransactionDate(e.target.value)}
                                />
                        </div>

                        {/*------------------------Description------------------------- */}
                        <div className="mb-3">
                            <label className="form-label">
                                Description
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                />
                        </div>
                        {/*--------------- BUTTON ----------------------------------- */}
                        <div className="d-flex justify-content-between">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={saving}
                        >
                        {saving 
                        ? 'Saving...' 
                        : mode === 'create'
                        ? 'Add Transaction'
                        : 'Update Transaction'}
                        </button>

                        <button className="btn btn-secondary"
                                type="button"
                                onClick={() => navigate(-1)}
                        >
                            Back
                        </button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
     </>
    );
}
