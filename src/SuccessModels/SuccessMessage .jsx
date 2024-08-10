import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle } from "react-icons/fa";
import "./SuccessMessage.css"; // Import the CSS file

const SuccessMessage = ({ message, onDismiss }) => {
  useEffect(() => {
    // Set up a timer to call onDismiss after 50 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 2000); // 50 seconds

    // Cleanup the timer if the component is unmounted before the timer completes
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="success-message-container">
      <div className="card success-message-card">
        <div className="card-body d-flex justify-content-center align-items-center">
          <FaCheckCircle className="icon-animation" size={54} />
        </div>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default SuccessMessage;
