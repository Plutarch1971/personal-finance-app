// CategoryManager.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategory from '../components/AddCategory';
import ManageCategory from '../components/ManageCategory';


 
export default function CategoryManager() {
            const [ activePanel, setActivePanel] = useState<'add' | 'manage' | null>(null); 
            
            const navigate = useNavigate();
                
            return (
                <>
                    <div className="container-fluid p-4">
                        <h1 className="mb-2 text-center text-white mt-4">Catagory Manager</h1>
                            <div className="row">
                                <aside className="col-12 col-lg-2 mt-4">
                                    
                                        <button
                                        className="btn btn-outline-light mt-2 w-100" 
                                        onClick={() => setActivePanel('add')}
                                        >
                                        Add New Category
                                        </button>

                                        <button
                                            className="btn btn-outline-light mt-2 w-100"
                                            onClick={() => 
                                                setActivePanel('manage')}
                                        >
                                        Manage Existing Category
                                        </button>

                                        <button 
                                            className="btn btn-primary btn-outline-light w-100"
                                            type={"button"}
                                            onClick={() => navigate('/dashboard')}
                                            >
                                                Dashboard
                                        </button>
                                </aside>
                    
                                                        
                                <main className="col-12 col-lg-10">
                                {activePanel === 'add' && (
                                    <AddCategory onClose={() => setActivePanel(null)} />
                                )}  
                                {activePanel === 'manage' && (
                                    <ManageCategory onClose={() => setActivePanel(null)} />
                                )}
                                    
                                </main>    
                            </div>                        
                    </div>   
                </>
        );
}