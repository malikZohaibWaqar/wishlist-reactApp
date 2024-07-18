import React, { useEffect, useState } from "react";
import Loading from "./loading";
import Error from "./error";
import CategoryModal from "./categoryModal";
import DeleteConfirmationModal from "./deleteconfirmation";

function Category({ onSelectCategory }) {
    const [category,setCategory] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [activeCategoryId,setActiveCategoryId] = useState(null);
    const [editingCategory, setEditingCategory] = useState({id:0,category:''});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const API_URL = 'http://localhost:15869/api/wishlist';

    const handleCategoryCreateUpdate = (newCategory) => {
        // Check if the category with the same ID already exists in the state
        const categoryExists = category.some(cat => cat.id === newCategory.id);
        //if exists it means update scanerio
        if (categoryExists) {
            // Update the existing category
            const updatedCategories = category.map(cat => {
               if (cat.id === newCategory.id) {
                    return newCategory; // Update the category with the new information
                }
                return cat; // Return unchanged category if not the one being updated
            });
            setCategory(updatedCategories);
        } else {
            // Add the new category
            setCategory([...category, newCategory]);
        }   
    };

    useEffect(() => {
        const fetchCategories = async()=>{
            try {
                const response = await fetch(`${API_URL}/GetAllCategories`);
                if(!response.ok)
                {
                    setError(response.status);
                }
                else
                {
                    const constFetchedCategories = await response.json();
                    setCategory(constFetchedCategories);
                }

            } catch (error) {
                setError(`${error.name} : ${error.message}`);
            }
            finally
            {
                setLoading(false);
            }
        };
        fetchCategories();
    },[]
    );

    const handleCategoryClick = (categoryId) => {
        setActiveCategoryId(categoryId);
        onSelectCategory(categoryId);
    };
    const handleEditCategory = (categoryToEdit) => {
        setEditingCategory(categoryToEdit);
    };
    const handleDeleteCategory = (categoryId) => {
        setCategoryToDelete(categoryId);
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/DeleteCategory/${categoryToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                setError(response.status);
            } else {
                const updatedCategories = category.filter(cat => cat.id !== categoryToDelete);
                setCategory(updatedCategories);
            }
        } catch (error) {
            setError(`${error.name} : ${error.message}`);
        } finally {
            setShowDeleteConfirmation(false);
        }
    };

    return (
        <div className="col-lg-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand">Category List</span>
                    <div className="d-flex">
                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#categoryModel">Create New Category</button>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                {loading && <Loading/>}
                {error && <Error error={error}/>}
                {
                    category && (
                        <ul className="list-group">
                            {
                                category.map((item) => 
                                    <li key={item.id} className={`list-group-item d-flex justify-content-between align-items-center ${item.id == activeCategoryId ? 'bg-warning' : ''}`} style={{cursor:"pointer"}}>
                                        <div className="flex-grow-1" onClick={()=>handleCategoryClick(item.id)}>   
                                            {item.category}
                                        </div>
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#categoryModel" onClick={()=>handleEditCategory({ id: item.id, category: item.category })} ><i className="bi bi-pencil-square"></i></button>
                                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategory(item.id)}><i className="bi bi-trash"></i></button>
                                        </div>
                                    </li>
                                )
                            }
                        </ul>        
                    )
                }
            </div>
            <CategoryModal 
                onCategoryCreatedUpdated={handleCategoryCreateUpdate} 
                category={editingCategory}
            />
            <DeleteConfirmationModal 
                deleteMessage = "Tasks in this category will also be deleted.Are you sure you want to delete this category?" 
                show={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    )
}
export default Category;