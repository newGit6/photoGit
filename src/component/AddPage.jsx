import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../Pages/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import SuccessMessage from "../SuccessModels/SuccessMessage ";
import confetti from "canvas-confetti";
import "aos/dist/aos.css";
import AOS from "aos";

const AddPage = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userID, setUserID] = useState(null);

  const navigate = useNavigate();

  const thumbnailsInputRef = useRef(null);
  const videosInputRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setUserID(user.id);
    }
  }, []);

  useEffect(() => {
    return () => {
      thumbnails.forEach((file) =>
        URL.revokeObjectURL(URL.createObjectURL(file))
      );
      videos.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, [thumbnails, videos]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const selectedFiles = Array.from(files).slice(0, 10);

    if (name === "thumbnails") {
      setThumbnails((prevFiles) => [...prevFiles, ...selectedFiles]);
    } else if (name === "videos") {
      setVideos((prevFiles) => [...prevFiles, ...selectedFiles]);
    }

    // Clear input fields after selection
    if (name === "thumbnails") {
      thumbnailsInputRef.current.value = null;
    } else if (name === "videos") {
      videosInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!userID || !/^[0-9a-fA-F]{24}$/.test(userID)) {
      setError("Invalid or missing userID.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    thumbnails.forEach((file) => formData.append("thumbnails", file));
    videos.forEach((file) => formData.append("videos", file));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("userID", userID);

    try {
      const response = await axios.post(
        "https://photoshopbackend-q7jc.onrender.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(response.data.message);
      handleConfetti();

      setTimeout(() => {
        navigate("/webpage1");
      }, 3000);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.response?.data?.error || "Error uploading files";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleDismiss = () => {
    setSuccess(null);
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid p-4 addpage ">
        <div className="container p-2">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card p-4 shadow-sm addCard" data-aos="flip-down">
                <h2 className="mb-4 text-center addtitle">Media Hub</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Thumbnails:</label>
                    <input
                      type="file"
                      name="thumbnails"
                      className="form-control"
                      accept="image/jpeg, image/png"
                      multiple
                      ref={thumbnailsInputRef}
                      onChange={handleFileChange}
                    />
                    <small className="form-text text-muted">
                      * Acceptable formats: JPG, PNG. Max 10 files.
                    </small>
                    <div className="mt-2">
                      {thumbnails.length > 0 && (
                        <div className="d-flex flex-wrap">
                          {thumbnails.map((file, index) => (
                            <img
                              key={index}
                              src={URL.createObjectURL(file)}
                              alt={`thumbnail-${index}`}
                              className="img-thumbnail me-2 mb-2"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Videos:</label>
                    <input
                      type="file"
                      name="videos"
                      className="form-control"
                      accept="video/mp4, video/mpeg, video/avi"
                      multiple
                      ref={videosInputRef}
                      onChange={handleFileChange}
                    />
                    <small className="form-text text-muted">
                      * Acceptable formats: MPG, AVI, MP4. Max 10 files.
                    </small>
                    <div className="mt-2">
                      {videos.length > 0 && (
                        <div className="d-flex flex-wrap">
                          {videos.map((file, index) => (
                            <video
                              key={index}
                              src={URL.createObjectURL(file)}
                              controls
                              className="me-2 mb-2"
                              style={{ width: "150px", height: "100px" }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="upload-btn w-75 text-center"
                    disabled={loading}
                  >
                    <span className="">
                      {loading ? "Uploading..." : "Upload"}
                    </span>
                  </button>
                </form>
                {success && (
                  <SuccessMessage message={success} onDismiss={handleDismiss} />
                )}
                {error && (
                  <div className="mt-3 alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPage;
