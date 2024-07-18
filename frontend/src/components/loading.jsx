import React from "react";

function Loading() {
    return (
        <div className="loading-container" style={{ textAlign: "center" }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
export default Loading;