// CategoryManager.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategory from '../components/AddCategory';


 
export default function CategoryManager() {
            const [ showAddCategory, setShowAddCategory ] = useState(false); 
            const navigate = useNavigate();
                
            return (
                <>
                    <div className="container-fluid p-2">
                        <h1 className="text-center text-white">Catagory Manager</h1>

                            <div className="row">
                                <aside className="col-12 col-lg-2">
                                    <div className="d-grid gap-2">
                                    
                                        
                                        <button
                                        className="btn btn-outline-light w-100"
                                        onClick={() => 
                                            setShowAddCategory((prev) => !prev)}
                                        >
                                        Manage Category
                                        </button>
                                        
                                        <button 
                                            className="btn btn-primary btn-outline-light w-100"
                                            type={"button"}
                                            onClick={() => navigate('/dashboard')}
                                            >
                                                Dashboard
                                        </button>
                                    </div>
                                </aside>
                            </div>
                                                                
                            <main className="col-12 col-lg-10">
                                {showAddCategory ? (
                                    <AddCategory onClose={() => setShowAddCategory(false)} />
                                ) : (
                                    <button
                                    className="btn btn-outline-light mt-2"
                                    onClick={() => setShowAddCategory(true)}
                                    >
                                        Add Category
                                    </button>
                                    )
                                }
                            </main>                                  
                    </div>   
                </>
        );
}