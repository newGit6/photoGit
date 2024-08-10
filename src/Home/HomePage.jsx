import React from "react";
import Navbar from "../Pages/Navbar";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import { RiShareForwardFill } from "react-icons/ri";

const HomePage = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/addpage");
  };

  return (
    <>
      <Navbar />
      <div className="text-container">
        <h1 className="text-center mb-4 capture">Capture & Cherish</h1>
        <p className="text-center mb-4 typing-effect">
          Capture the essence of every moment, and let your photos and videos
          tell the stories you cherish forever.
        </p>
        <div className="d-flex justify-content-center">
          <button className="btn btn-lg btn-grow" onClick={handleButtonClick}>
            Explore Now <RiShareForwardFill />
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
