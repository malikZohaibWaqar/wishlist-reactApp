import React, { useState,useEffect } from 'react';

function CategoryModal({ onCategoryCreatedUpdated,category }) {
  
  const [formData, setFormData] = useState({
    id: category ? category.id : 0,
    category: category ? category.category : '',
  }); // if edit scanerio then initial data binding with category otherwise default values

  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  
 // Fetch initial category data (on category change)
  useEffect(() => {
    setFormData({
      id: category ? category.id : 0,
      category: category ? category.category : '',
    });
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((category) => ({
      ...category,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
       postFormData();
    }
  }

  const validateForm = () => {
    let errors = {};
    if (!formData.category) {
      errors.category = "Category name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  }

  const postFormData = async () => {
    try {
        const API_URL = formData.id === 0 ? (`http://localhost:15869/api/wishlist/CreateCategory`) : (`http://localhost:15869/api/wishlist/UpdateCategory`);
        const METHOD = formData.id === 0 ? 'POST' : 'PUT';
        const response = await fetch(API_URL, {
          method: METHOD,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData), //This Data Should exactly match the entity model in WebAPI. (Attributes & dataType)
      });

      if (!response.ok) {
        setApiError(response.status);
      }
      else{
        const result = await response.json();  
        onCategoryCreatedUpdated(result); // Pass the new category to the parent      
        document.getElementById('modelCloseButton').click()  // Once Category creation is succesfull then close the model programatically.
      }
    } catch (error) {
      setApiError(`${error.name} : ${error.message}`);
    }
  };

  const handleModelClose = () => {
    setFormData({
      id: 0,
      category: '',
    });
    setFormErrors({});
    setApiError(null);
  };

  return (
    <div className="modal fade" id="categoryModel" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Add new category</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {handleModelClose}}></button>
            </div>
            <div className="modal-body">
              {apiError && <div className="alert alert-danger">{apiError}</div>}
              <div className="mb-3">
                <label className="col-form-label">Category:</label>
                <input type="text" className="form-control" name="category" value={formData.category ? formData.category : ''} onChange={handleChange} />
                {formErrors.category && <span style={{color:"red"}}>{formErrors.category}</span>}
              </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="modelCloseButton" onClick={() => {handleModelClose}}>Close</button>
              <button type="submit" className="btn btn-primary"> {category ? 'Save category' : 'Update category'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;