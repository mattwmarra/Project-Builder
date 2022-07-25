import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="loading">
      <FaSpinner size={70} />
    </div>
  );
};

export default Loading;
