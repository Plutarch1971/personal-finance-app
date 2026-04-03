// CategoryManager.tsx
import api from '../api/axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


 interface Category{
    id: string;
    userId: string;
    name: string;
    type: 'income' | 'expense';
    parentId?: string | null;
 }

export default function CategoryManager() {
            const [ loading, setLoading ] = useState(true);
            const [ selectedType, setSelectedType ] = useState<'income'|'expense'>('expense');
            const [ category, setCategory] = useState<Category[]>([]);
            const [ newName, setNewName ] = useState('');
            const [ selectedParent, setSelectedParent ] = useState<string | null>(null);
            const [ editingId, setEditingId ] = useState<string | null>(null);
            const [ editingName, setEditingName ] = useState('');

            const navigate = useNavigate();
 
            const fetchCategories = async (type: 'income' | 'expense') => {
                const res = await api.get('/categories', { params: { type}});
                setCategory(res.data);
            }
            
            useEffect(() => {
                let mounted = true;
                (async () => {
                    try {
                        await fetchCategories(selectedType);
                    } catch(err) {
                        console.error('Failed to load categories', err);
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
                }
            };
            
            // Filter Category Types
            const filteredCategories = category.filter((c) => c.type === selectedType);
            // Filter Parents and Children categories
            const parents = filteredCategories.filter(c => !c.parentId);
            const children = filteredCategories.filter(c => c.parentId);

            const getChildren = (parentId: string) => 
                children.filter(c => c.parentId === parentId);

            const handleAdd = async ()=> {
                // Check if category name already exists
                const normalizedNewName = newName.trim().toLowerCase();

                const categoryExists = category.some(
                    (c) => 
                        c.type === selectedType &&
                        c.parentId === selectedParent &&
                        c.name.trim().toLowerCase() === normalizedNewName
                );

                if (categoryExists) {
                    alert('This category already exists'); 
                    return;
                }

                if(!newName.trim()) {
                    alert('Please enter a category name');
                    return;
                }
            await api.post('/categories', {
                name: newName,
                type: selectedType,
                parentId: selectedParent, //null => parent category, id => child category 
            });
            setNewName(''); // Clear the input after adding
            setSelectedParent(null);
            refreshCategories();
            
            } 

            const handleUpdate = async (id: string) => {
                await api.put(`/categories/${id}`, {
                    name: editingName,
                    type: selectedType,
                    parentId: selectedParent
                });
                setEditingId(null);
                refreshCategories();
            }

            const handleDelete = async (id: string) => {
                if(!confirm('Delete this category?')) return;

                try {
                await api.delete(`/categories/${id}`);
                refreshCategories();
                } catch (err: any) {
                    alert(err.response?.data?.error || "Cannot delete.");
                }
            };
                
            if (loading) return  <div className="ps-5">Loading...</div>;
                
            return (
                <>
            <div className="container py-4">
                <div className="position-relative d-flex align-items-center">
                <h1 className="position-absolute start-50 translate-middle-x mb-4 text-white">Category Manager</h1>
                <button 
                  className="btn btn-light ms-auto position-relative w-80 mb-4 me-2"
                  type={"button"}
                  onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                </button>
                </div>
                <div className="card mb-4 p-4">
                    <h2 className="h5 mb-3">Manage Your Categories</h2>
                    <form className="row g-2 align-items-center" onSubmit={(e) => {e.preventDefault(); handleAdd();}}>
                        <div className="col-12 col-md-4">
                        <select
                            className="form-select"
                            value={selectedParent ?? ''}
                            onChange={(e) => setSelectedParent(e.target.value || null)}
                        >
                            <option value="">No parent (top-level)</option>
                            {parents.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        </div>
                        <div className="col-12 col-md-5">
                        <input
                            className="form-control"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Category name"
                        />
                        </div>
                        <div className="col-12 col-md-3">
                        <button type="submit" className="btn btn-primary w-100">Add Category</button>
                        </div>
                        </form>
                        </div>
                        <div className="mb-3">
                            <button
                             className={'btn-dark btn-outline-secondary'}
                             onClick={() => 
                                setSelectedType('expense')}
                             >
                                Expense
                             </button>
                             <button
                              className={'btn-dark btn-outline-secondary'}
                              onClick={() =>
                                setSelectedType('income')
                              }
                              >
                                Income
                              </button>
                        </div>
                    
                        <div className="card p-3">
                        {parents.map((parent) => (
                        <div key={parent.id} className="mb-4">
                            <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom border-2">
                                <strong>{parent.name}</strong>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(parent.id)}>Edit</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(parent.id)}>Delete</button>
                                </div>
                            </div>
                        <div className="ms-3">
                        {getChildren(parent.id).map((child) => (
                        <div key={child.id} className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                            {editingId === child.id ? (
                                <>
                            <input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                            />
                            <button onClick={() => handleUpdate(child.id)}>Save</button>
                            </>
                            ) :  (
                            <>
                                <span>{child.name}</span>
                            <div>
                                <button onClick={() => setEditingId(child.id)}>Edit</button>
                                <button onClick={() => handleDelete(child.id)}>Delete</button>
                            </div>
                            </>
                        )}
                    </div>
                    ))}
                    </div>
                </div>
                ))}
            </div>
        </div>
    </>
);
}