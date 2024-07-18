import React,{useState} from "react";

function DeleteConfirmationModal({ deleteMessage,show, onClose, onDelete }){
    return(
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Delete</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {deleteMessage}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={() => { onDelete(); onClose(); }}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmationModal;