// ManageCategory.tsx
import api from '../api/axios';
import { useState, useEffect } from 'react';

 interface Category{
    id: string;
    userId: string;
    name: string;
    type: 'income' | 'expense';
    parentId?: string | null;
 }

 type ManageCategoryProps = {
    onClose: () => void;
 };

export default function ManageCategory({ onClose }: ManageCategoryProps) {
            const [ loading, setLoading ] = useState(true);
            const [ selectedType, setSelectedType ] = useState<'income'|'expense'>('expense');
            const [ category, setCategory] = useState<Category[]>([]);
            const [ editingId, setEditingId ] = useState<string | null>(null);
            const [ editingName, setEditingName ] = useState('');

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
 
            const startEdit = (category: Category) => {
                setEditingId(category.id);
                setEditingName(category.name);
            };

            const cancelEdit = () => {
                setEditingId(null);
                setEditingName('');

            }
            const handleUpdate = async (category: Category) => {
                const trimmed = editingName.trim();
                if(!trimmed) {
                    alert('Category name cannot be empty');
                    return;
                }

                try {
                await api.put(`/categories/${category.id}`, {
                    name: trimmed,
                    type: category.type,
                    parentId: category.parentId ?? null
                });
                cancelEdit();
                await refreshCategories();
            } catch (err: any) {
                alert(err.response?.data?.error || 'Failed to update category');
            }
         };

            const handleDelete = async (id: string) => {
                if(!confirm('Delete this category?')) return;

                try {
                await api.delete('/categories/' + id);
                await refreshCategories();
                } catch (err: any) {
                    alert(err.response?.data?.error || "Cannot delete.");
                }
            };
                
            if (loading) return  <div className="ps-5">Loading...</div>;
                
            return (
                <>
                <div className="container">
                    <div className="row">
                                
                        <div className="col-10 col-md-8 mt-4 p-2 ms-2" style={{width: '1200px'}}> 
                            
                        <div className="card p-4">
                
                            <div className="col-lg-12 col-md-4 mt-4">
                                <div className="d-flex justify-content-center align-items-center gap-3 w-100 flex-wrap">
                                    <h4 className="text-primary">Manage Your Catagories</h4>
                                    <button className="btn btn-outline-secondary"
                                            onClick={() => setSelectedType('income')

                                    }
                                    >
                                    View Income Categories
                                    </button>
                                    <button className="btn btn-outline-secondary"
                                            onClick={() => setSelectedType('expense')

                                    }
                                    >
                                    View Expense Categories
                                    </button>

                                    <button className="btn btn-outline-secondary mb-2"
                                            onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                            {/* <main className="col-12 col-lg-10 p-3 mx-auto text-center"> */}
                            <main className="p-2">
                                <div className="fw-semibold mb-3 text-center">
                                {selectedType === 'income' ? 'Income Categories' : 'Expense Categories'}
                                </div>
                                    {parents.map((parent) => (
                                    <div key={parent.id} className="mb-4">
                                        {/* <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom border-2"> */}
                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-2 border-bottom border-2">
                                            <strong>{parent.name}</strong>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn same-btn btn-outline-success" 
                                                    onClick={() => startEdit(parent)}
                                                >
                                                 Edit
                                                </button>

                                                <button 
                                                    className="btn same-btn btn-outline-secondary" 
                                                    onClick={cancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    className="btn same-btn btn-outline-danger" 
                                                    onClick={() => handleDelete(parent.id)}
                                                    >
                                                    Delete
                                                    </button>
                                            </div>
                                        </div>

                                    <div className="ms-3 ms-sm-3">
                                    {getChildren(parent.id).map((child) => (
                                    <div key={child.id} 
                                        className="d-flex  flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center pb-2 mb-2 border-bottom">
                                        {editingId === child.id ? (

                                        <div    className="d-flex flex-wrap gap-2 w-100">
                                            
                                                <input
                                                    className="form-control form-control-sm"
                                                    style={{maxWidth: 260}}
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                />
                                                <button 
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => handleUpdate(child)}
                                                >
                                                Save
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={cancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                                </div>
                    
                                        ) :  (
                                        <>
                                            <span>{child.name}</span>
                                        <div className="d-flex flex-wrap gap-2">
                                            <button 
                                                className="btn same-btn btn-outline-success" 
                                                onClick={() => startEdit(child)}
                                            >
                                                Edit
                                            </button>
                                        
                                            <button 
                                                className="btn same-btn btn-outline-secondary" 
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </button>

                                            <button 
                                                className="btn same-btn btn-outline-danger" 
                                                onClick={() => handleDelete(child.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        </>
                                        )}
                                        </div>
                                        ))}
                                    </div>
                                    </div>
            
                                ))}
                                </main>
                            </div>
                        </div>
                    </div>       
             </div>   
    </>
);
}