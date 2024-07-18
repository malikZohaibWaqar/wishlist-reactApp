import React, { useEffect, useState } from "react";
import Loading from "./loading";
import Error from "./error";
import TaskModal from "./taskModal";
import DeleteConfirmationModal from "./deleteconfirmation";

function Task({ categoryId }) {
    const [task, setTask] = useState(null);
    const [filteredTask, setFilteredTask] = useState(null); // To be used to display filtered Tasks
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePriority, setActivePriority] = useState("all");
    const [activeSort, setActiveSort] = useState("all");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const [taskModel,setTaskModel] = useState({});
    const API_URL = 'http://localhost:15869/api/wishlist';
    
    const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    const priorityInfo = {
        High: {
            className: 'bg-danger',
            icon: 'bi-exclamation-circle-fill',
        },
        Medium: {
            className: 'bg-warning',
            icon: 'bi-exclamation-triangle-fill',
        },
        Low: {
            className: 'bg-info',
            icon: 'bi-info-circle-fill',
        },
    };

    

    useEffect(() => {
        const fetchTaskByCategoryId = async () => {
            try {
                if (categoryId == null) {
                    setError("Select Category to load Tasks");
                    setLoading(false);
                }
                else {
                    const response = await fetch(`${API_URL}/GetAllTask?categoryId=${categoryId}`);
                    if (!response.ok) {
                        setError(response.status);
                    }
                    else {
                        const fetchedTaskByCategoryId = await response.json();
                        setError(null);
                        setTask(fetchedTaskByCategoryId);
                    }
                }
            } catch (error) {
                setError(`${error.name} : ${error.message}`);
            }
            finally {
                setLoading(false);
            }
        };
        fetchTaskByCategoryId();
    }, [categoryId]
    );
    // This hook is used to call applyPriorityAndSortOnTask Method when Task,activePriority and activeSort state is changed - i:e Task are loaded 
    useEffect(()=>{
        applyPriorityAndSortOnTask();
    },[task,activePriority,activeSort]);

    const handlePriorityClick = (priority) => {
        setActivePriority(priority);
    }
    const handleSortClick = (sort) => {
        setActiveSort(sort);
    }
    const applyPriorityAndSortOnTask = () => {
        if (task && task.length > 0) {
            let taskBasedOnPriorityAndSort = [...task];
            //Apply priority filter if there is any selected other than "all".
            if (activePriority != "all") {
                taskBasedOnPriorityAndSort = taskBasedOnPriorityAndSort.filter(t => t.priority.toLowerCase() === activePriority);
            }
            //Apply sort filter if there is any selected other than "all".
            if (activeSort != "all") {
                taskBasedOnPriorityAndSort = taskBasedOnPriorityAndSort.filter(t => t.status.toLowerCase() === activeSort);
            }

            //Once both filter applied now set the filteredTask 
            setFilteredTask(taskBasedOnPriorityAndSort);
        }
    }

    const handleCreateTaskClick = () => {
        setTaskModel({
            id : 0,
            task : '',
            dateCreated : new Date().toLocaleDateString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).split('/').reverse().join('-'),
            dateDue : new Date().toLocaleDateString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).split('/').reverse().join('-'),
            priority : 'High',
            status : 'Active',
            categoryId : categoryId
        });
    }
    const handleEditTask = (taskId) => {
        const foundTask = task.find(_task => _task.id === taskId);
        if(foundTask){
            setTaskModel({
                id : foundTask.id,
                task : foundTask.task,
                dateCreated : new Date(foundTask.dateCreated).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }).split('/').reverse().join('-'),
                dateDue : new Date(foundTask.dateDue).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }).split('/').reverse().join('-'),
                priority : foundTask.priority,
                status : foundTask.status,
                categoryId : foundTask.categoryId
            });
        }
    }
    const handleCloseModel = () => {
    }
    const handleTaskCreateUpdate = (newTask) => {
        // Check if the category with the same ID already exists in the state
        const TaskExists = task.some(_task => _task.id === newTask.id);
        //if exists it means update scanerio
        if (TaskExists) {
            // Update the existing category
            const updatedTasks = task.map(_task => {
               if (_task.id === newTask.id) {
                    return newTask; // Update the category with the new information
                }
                return _task; // Return unchanged category if not the one being updated
            });
            setTask(updatedTasks);
        } else {
            // Add the new category
            setTask([...task, newTask]);
        }   
    }
    const handleDeleteTask = (taskId) => {
        setTaskToDelete(taskId);
        setShowDeleteConfirmation(true);
    };
    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/DeleteTask/${taskToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                setError(response.status);
            } else {
                const updatedTasks = task.filter(_task => _task.id !== taskToDelete);
                setTask(updatedTasks);
            }
        } catch (error) {
            setError(`${error.name} : ${error.message}`);
        } finally {
            setShowDeleteConfirmation(false);
        }
    };


    return (
        <div className="col-lg-8">
            <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{pointerEvents:categoryId==null?'none':'all'}}>
                <div className="container-fluid">
                    <span className="navbar-brand">Task List</span>

                    <div className="navbar-nav me-auto">
                        <button className={`btn btn-outline-secondary me-2 ${activePriority == 'all' ? 'active' : ''}`} title="View All" onClick={() => handlePriorityClick("all")}>
                            <i className="bi bi-eye-fill"></i> View All
                        </button>

                        <button className={`btn btn-outline-danger me-2 ${activePriority == 'high' ? 'active' : ''}`} title="High Priority" onClick={() => handlePriorityClick("high")}>
                            <i className="bi bi-exclamation-circle-fill"></i> High Priority
                        </button>
                        <button className={`btn btn-outline-warning me-2 ${activePriority == 'medium' ? 'active' : ''}`} title="Medium Priority" onClick={() => handlePriorityClick("medium")}>
                            <i className="bi bi-exclamation-triangle-fill"></i> Medium Priority
                        </button>
                        <button className={`btn btn-outline-info me-2 ${activePriority == 'low' ? 'active' : ''}`} title="Low Priority" onClick={() => handlePriorityClick("low")}>
                            <i className="bi bi-info-circle-fill"></i> Low Priority
                        </button>
                    </div>

                    <div className="d-flex">
                        <div className="dropdown me-2">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                                <li><a className={`dropdown-item ${activeSort == 'all' ? 'active' : ''}`} href="#" onClick={() => handleSortClick("all")}>All</a></li>
                                <li><a className={`dropdown-item ${activeSort == 'active' ? 'active' : ''}`} href="#" onClick={() => handleSortClick("active")}>Active</a></li>
                                <li><a className={`dropdown-item ${activeSort == 'completed' ? 'active' : ''}`} href="#" onClick={() => handleSortClick("completed")}>Completed</a></li>
                            </ul>
                        </div>
                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#taskModel" onClick={handleCreateTaskClick}>Create New Task</button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                {loading && <Loading />}
                {error && <Error error={error} />}
                {
                    filteredTask && (
                        <ul className="list-group">
                            {
                                filteredTask.length > 0 ? (
                                    filteredTask.map((item) =>
                                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center mix">
                                            <div className="flex-grow-1" style={{ textDecorationLine: item.status === 'Completed' ? 'line-through' : 'none' }}>
                                                {item.task}
                                                <div>
                                                    <span className={`badge ${priorityInfo[item.priority].className} me-1`}>
                                                        <i className={`bi ${priorityInfo[item.priority].icon}`}></i> {item.priority}
                                                    </span>
                                                    <span className="badge bg-primary me-1">Created: {new Date(item.dateCreated).toLocaleDateString('en-US', dateOptions)}</span>
                                                    <span className="badge bg-danger">Due: {new Date(item.dateDue).toLocaleDateString('en-US', dateOptions)}</span>
                                                </div>
                                            </div>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#taskModel" onClick={() => {handleEditTask(item.id)}}><i className="bi bi-pencil-square"></i></button>
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTask(item.id)}><i className="bi bi-trash"></i></button>
                                            </div>
                                        </li>
                                    )
                                ) :
                                    (
                                        <li className="list-group-item bg-warning"> Task not found </li>
                                    )
                            }
                        </ul>
                    )
                }
            </div>
            <TaskModal 
                onCreateUpdate = {handleTaskCreateUpdate}   // To deal when model submit successfully - parent task list update or add handling
                task={taskModel}                           // Initaly when create task click it should be default as new task is created
            />
            <DeleteConfirmationModal 
                deleteMessage = "Are you sure you want to delete this task?" 
                show={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    )
}

export default Task;