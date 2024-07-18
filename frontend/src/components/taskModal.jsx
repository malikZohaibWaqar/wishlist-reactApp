import React, { useEffect, useState } from 'react';

function TaskModal({ onCreateUpdate, task }) {
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    task: '',
    dateCreated: new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).split('/').reverse().join('-'),
    dateDue: new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).split('/').reverse().join('-'),
    priority: 'High',
    status: 'Active',
    categoryId: 0
  });

  useEffect(() => {
    setFormData(task)
  }, [task]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
       postFormData();
    }
  }
  const validateForm = () => {
    let errors = {};
    if (!formData.task) {
      errors.task = "task is required";
    }
    if (!formData.dateDue) {
      errors.dateDue = "Due date is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  }

  const postFormData = async () => {
    try {
      const API_URL = formData.id === 0 ? (`http://localhost:15869/api/wishlist/CreateTask`) : (`http://localhost:15869/api/wishlist/UpdateTask`);
      const METHOD = formData.id === 0 ? 'POST' : 'PUT';
      const response = await fetch(API_URL, {
        method: METHOD,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        setApiError(response.status);
      }
      else {
        const result = await response.json();
        onCreateUpdate(result);
      }

    } catch (error) {
      setApiError(`${error.name} : ${error.message}`);
    }
  }

  return (
    <div className="modal fade" id="taskModel" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Add new task</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {apiError && <div className="alert alert-danger">{apiError}</div>}
              <div className="mb-3">
                <label className="col-form-label">Task:</label>
                <input type="text" className="form-control" name="task" value={formData.task} onChange={handleInputChange} />
                {formErrors.task && <span style={{ color: "red" }}>{formErrors.task}</span>}
              </div>
              <div className="mb-3">
                <label className="col-form-label">Due Date:</label>
                <input type="date" className="form-control" name="dateDue" value={formData.dateDue} onChange={handleInputChange} />
                {formErrors.dateDue && <span style={{ color: "red" }}>{formErrors.dateDue}</span>}
              </div>
              <div className="mb-3">
                <label className="col-form-label">Priority:</label>
                <select className="form-select" name="priority" value={formData.priority} onChange={ handleInputChange}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary">{formData.id == 0 ? 'Save task' : 'Update task'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;