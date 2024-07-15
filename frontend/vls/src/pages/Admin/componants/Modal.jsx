// Modal.jsx

import React from "react";
import "./Modal.css"; // Ensure this file exists

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-background">
      <div className="modal-content">
        {/* <button className="close-button" onClick={onClose}>
          &times;
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;