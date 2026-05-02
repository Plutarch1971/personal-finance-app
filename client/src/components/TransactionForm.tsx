import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import AccountDropdown from '../components/AccountDropdown';
import CategoryDropdown from '../components/CategoryDropdown';
import ReceiptCapture from '../components/ReceiptCapture';

type AccountType = 'checking' | 'savings' | 'credit' |'investment';

interface Account {
    id: string;
    name: string;
    type: AccountType;
    balance: number;
}
interface GroupedAccounts {
    bank: Account[];
    credit: Account[];
    investment: Account[];
}

 interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    parentId?: string | null;
    parentName: string;
}
 type TransactionType = 'income' | 'expense' |'transfer';
 type Mode = 'create' |'edit';

 interface TransactionFormProps {
    mode: Mode;
    initialData?: {
        id?: string;
        accountId: string;
        toAccountId?: string;

        categoryId: string;
        amount: number;
        description?: string | null;
        transactionDate: string;
    };
    onSubmit: (data: any) => Promise<void>;
    onClose?: () => void;
 }

export default function TransactionForm({mode, initialData, onSubmit, onClose}: TransactionFormProps){
     
     // ------------state-----------------
    
    const [accounts, setAccounts] = useState<GroupedAccounts>({
        bank: [],
        credit: [],
        investment: []
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    

    const [accountId, setAccountId] = useState('');
    const [toAccountId, setToAccountId] = useState('');

    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [description, setDescription] = useState('');
    const [transactionType, setTransactionType] = useState<TransactionType>('expense')
    const [activeView, setActiveView] = useState< 'ExtractReceipt' | null>(null);
    
/*---------------LOAD ACCOUNTS + CATEGOIRES---------------------------*/ 
   useEffect(() => {
     async function loadData(){
            try {
            const [accountsRes, categoriesRes] = await Promise.all([
                api.get('/accounts/grouped'),
                api.get('/categories'),
            ]);
            setAccounts(accountsRes.data);
            setCategories(categoriesRes.data);
            console.log("Accounts: ", accountsRes.data);
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



    // -----------------------FILTER ACCOUNTS ------------------------------------
    let accountGroups: Record<string, Account[]> = {
        "Bank Accounts": accounts.bank   
     };

     if (transactionType === "expense") {
        accountGroups["Credit Accounts"] = accounts.credit;
     }

     if (transactionType === "transfer") {
        accountGroups["Credit Accounts"] = accounts.credit;
        accountGroups["Investment Accounts"] = accounts.investment;
        //accounts.investment.filter(acc => acc.name !== "Investment");
        console.log("Investment accounts", accounts.investment);
     }
    

    //-------------------Grouping CATEGORIES-----------------------------------
    const grouped = categories
        .filter(cat => cat.type === transactionType)
        .reduce<Record<string, Category[]>>(
        (acc, cat) => {
            const parent = cat.parentName || "Other";

            if (!acc[parent]) acc[parent] = [];

            acc[parent].push(cat);

            return acc;
        },
        {}
    );
         
   
    /**?------------------ SUBMIT -------------------- */
    const handleSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!accountId || !amount || !transactionDate) {
        alert('Please fill all required fields');
        return;
    }

    if (transactionType !== 'transfer' && !categoryId) {
        alert( 'Please select category');
        return;
    }

    if (transactionType === 'transfer' && !toAccountId) {
        alert('Please select destination account');
        return;
    }

    let finalAmount = Number(amount);

        if ( transactionType === 'expense' ) {
            finalAmount = -Math.abs(Number(amount))
        }
         
        if ( transactionType === 'income' ) {
            finalAmount = Math.abs(Number(amount))
        }
          
            

    const payload = {
            type: transactionType,
            accountId,
            toAccountId:transactionType === 'transfer' ? toAccountId : null,
            categoryId: transactionType === 'transfer' ? null : categoryId,
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
                            const type = e.target.value as TransactionType;
                            setTransactionType(type);

                            setCategoryId('');
                            setToAccountId('');
                            setAccountId('');
                        }}
                        >
                            <option value="">Select type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="transfer">Transfer</option>
                        </select>
                    </div>

        {/*--------------------ACCOUNT RENDERING--------------------------- */}
            
                       
                        <div className="mb-3">
                        <label className="form-label">Account</label>

                        <AccountDropdown
                         groups={accountGroups}
                         value={accountId}
                         onChange={setAccountId}
                         />
                         </div>

        {/**----------------------- TRANSFER ------------------------------ */}
                    {transactionType === 'transfer' && (
                        <div className="mb-3">
                            <label className="form-label">To Account</label>
                            <select 
                              className="form-select"
                              value={toAccountId}
                              onChange={(e) => setToAccountId(e.target.value)}
                            >
                            <option value="">Select destination account</option>    
                                <optgroup label="Bank Accounts">
                                {accounts.bank
                                    .filter(a => a.id !== accountId)
                                    .map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </option>
                                ))}
                                </optgroup>

                                <optgroup label="Credit Accounts">
                                {accounts.credit
                                    .filter(a => a.id !== accountId)
                                    .map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </option>
                                ))}
                                </optgroup>
                                 <optgroup label="Investment Accounts">
                                    {accounts.investment
                                        .filter(acc => acc.name !== "Investment")
                                        .map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.name}
                                        </option>
                                        ))}
                                </optgroup>

                             </select> 
                        </div>     
                    )}

        {/*------------------------ CATEGORY ------------------------------*/}
                    {transactionType !== 'transfer' && (                       
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                        
                            <CategoryDropdown 
                                categories={grouped}
                                value={categoryId}
                                onChange={setCategoryId}
                                />     
                               </div>
                           
                    )}
                {/* ------------Extract expense data from Receipt---------------------------- */}
                <div className="d-flex flex-column flex-wrap mb-3">
                    <label className="mb-2">Fill in expense data from receipt</label>
                    <button type="button" className="btn btn-primary" style={{maxWidth: '265px'}}
                            onClick={() => setActiveView('ExtractReceipt')}              
                    >
                        Extract Receipt
                    </button>
                    {activeView === 'ExtractReceipt' && (
                    <ReceiptCapture 
                        onClose={() => setActiveView(null)} 
                        onExtracted={(draft) => {
                            if (draft.total) setAmount(draft.total.toString());
                            if (draft.receiptDate) {
                                // Extract just YYYY-MM-DD from potential ISO string
                                setTransactionDate(draft.receiptDate.split('T')[0]);
                            }
                            if (draft.merchantName) setDescription(`Receipt: ${draft.merchantName}`);
                            setActiveView(null);
                        }}
                    />      
                )}
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
                                onClick={() => {onClose?.()}}                              
                        >
                            Close
                        </button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
     </>
    );
}
