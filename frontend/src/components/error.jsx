import React from "react";

function Error({error}) {
    return (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
                {error}
            </div>
        </div>
    )
}
export default Error;