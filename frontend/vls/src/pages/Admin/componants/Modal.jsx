// Modal.jsx

import React from "react";
import "./modal.css"; // Ensure this file exists

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-background">
      <div className="modal-content">{children}</div>
    </div>
  );
};

export default Modal;
