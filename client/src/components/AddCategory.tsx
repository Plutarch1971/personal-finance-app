// CategoryManager.tsx
import api from '../api/axios';
import { useState, useEffect } from 'react';

 interface Category{
    id: string;
    userId: string;
    name: string;
    type: 'income' | 'expense';
    parentId?: string | null;
 }

 type AddCategoryProps = {
    onClose?: () => void;
 };

export default function AddCategory({ onClose } : AddCategoryProps) {
    const [ loading, setLoading ] = useState(true);
    const [ selectedType, setSelectedType ] = useState<'income'|'expense'>('expense');
    const [ category, setCategory] = useState<Category[]>([]);
    const [ newName, setNewName ] = useState('');
    const [ selectedParent, setSelectedParent ] = useState<string | null>(null);
    const [ error, setError ] = useState('');
    

    const fetchCategories = async (type: 'income' | 'expense') => {
        const res = await api.get('/categories', { params: { type}});
        setCategory(res.data);
    }
    
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError('');
                await fetchCategories(selectedType);
            } catch(err) {
                console.error('Failed to load categories', err);
                if (mounted) setError('Failed to load categories');
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [selectedType]);

    const refreshCategories = async () => {
        try {
                await fetchCategories(selectedType);
            } catch (err) {
                console.error('Failed to refresh categories:', err);
                setError('Failed to refresh categories');
            }
    };
    
    const filteredCategories = category.filter((c) => c.type === selectedType);
    const parents = filteredCategories.filter(c => !c.parentId);

    
    const handleAdd = async ()=> {
        // Check if category name already exists
        const normalizedNewName = newName.trim().toLowerCase();

        if(!normalizedNewName) {
            setError('Please enter a category name.');
            return;
        }
        const categoryExists = filteredCategories.some(
            (c) => 
                c.type === selectedType &&
                c.parentId === selectedParent &&
                c.name.trim().toLowerCase() === normalizedNewName
            );

        if (categoryExists) {
            setError('This category already exists for the selected parent/type'); 
            return;
        }

        try {
            await api.post('/categories', {
                name: newName.trim(),
                type: selectedType,
                parentId: selectedParent, //null => parent category, id => child category 
            });
            setNewName(''); // Clear the input after adding
            setSelectedParent(null);
            refreshCategories();
            }catch (err: any) {
                console.error('Failed to create category', err);
                setError(err?.response?.data?.error || 'Failed to create new category');

            }
    
    }; 

    if (loading) return  <div className="ps-5">Loading...</div>;
        
    return (
        <>
            <div className="container p-2">
                <div className="row">
                    <div className="col-10 col-md-10 mt-4"> 
                        <div className="card mb-4 p-4 w-100">
                            <h2 className="h5 mb-3">Create a New Catagory</h2>

                            <div className="d-flex gap-2 mb-3">
                                <button 
                                    type="button"
                                    className={`btn ${selectedType === 'expense' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => {
                                        setSelectedType('expense');
                                        setError('');
                                    }}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    className={` btn ${selectedType === 'income' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => {
                                        setSelectedType('income');
                                        setError('');
                                    }}
                                    >
                                        Income
                                    </button>
                            </div>

                            <h6 className="mb-3">
                                {selectedType === 'income' ? 'Income Categories' : 'Expense Categories'}
                            </h6>
                            { error && (
                                <div className="alert alert-danger py-2" role="alert">
                                {error}
                                </div>
                            )}
                            
                            <form 
                                className="row g-2 align-items-center" 
                                onSubmit={(e) => {
                                    e.preventDefault(); 
                                    handleAdd();
                                    }}
                                >
                                <div className="col-12 col-md-4">
                                    <select
                                        className="form-select"
                                        value={selectedParent ?? ''}
                                        onChange={(e) => setSelectedParent(e.target.value || null)}
                                        title="Select a parent to add a child category. Leave empty to add a parent category."
                                    >
                                        <option value="">No parent (create parent category)</option>
                                        {parents.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-12 col-md-5 d-flex jutify-content-center flex-row">
                                    <input
                                        className="form-control"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder={selectedParent ? 'Create a child category' : 'Create a parent category'}
                                    />
                                </div>

                                <div className="col-12 col-md-3">
                                    <button type="submit" className="btn btn-primary w-100">
                                        Submit
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary w-100 mt-2" 
                                        onClick={() => {
                                        setNewName(''); 
                                        setSelectedParent(null);
                                        setError('');
                                        onClose?.();
                                    }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>           
                    </div>  
                 </div>                           
            </div>       
        </>
    );
}