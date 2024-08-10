import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Pages/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const [videos, setVideos] = useState([]);
  const [newThumbnails, setNewThumbnails] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userID, setUserID] = useState(null);

  const thumbnailsInputRef = useRef(null);
  const videosInputRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4563/api/videos/${id}`
        );
        const videoData = response.data;

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          setError("User ID not found.");
          return;
        }
        setUserID(user.id);

        if (videoData.userID !== user.id) {
          setError("You are not authorized to update this video.");
          return;
        }

        setTitle(videoData.title || "");
        setDescription(videoData.description || "");
        setThumbnails(videoData.thumbnails || []);
        setVideos(videoData.videos || []);
      } catch (err) {
        console.error("Error fetching video details:", err);
        setError("Error fetching video details");
      }
    };

    fetchVideo();
  }, [id]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const selectedFiles = Array.from(files);

    if (name === "thumbnails") {
      setNewThumbnails((prev) => [...prev, ...selectedFiles]);
      thumbnailsInputRef.current.value = null;
    } else if (name === "videos") {
      setNewVideos((prev) => [...prev, ...selectedFiles]);
      videosInputRef.current.value = null;
    }
  };

  const handleDeleteThumbnail = (index) => {
    setThumbnails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userID) {
      setError("User ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();

    // Append existing thumbnails and videos
    thumbnails.forEach((file) => {
      if (typeof file === "string") {
        formData.append("existingThumbnails", file);
      } else {
        formData.append("existingThumbnails", file);
      }
    });

    videos.forEach((file) => {
      if (typeof file === "string") {
        formData.append("existingVideos", file);
      } else {
        formData.append("existingVideos", file);
      }
    });

    // Append new thumbnails and videos
    newThumbnails.forEach((file) => {
      formData.append("thumbnails", file);
    });

    newVideos.forEach((file) => {
      formData.append("videos", file);
    });

    formData.append("title", title);
    formData.append("description", description);
    formData.append("userID", userID);

    try {
      await axios.put(`http://localhost:4563/api/videos/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Video updated successfully!");
      setTimeout(() => {
        navigate(`/video/${id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Error updating video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid updateContainer">
        <div className="container containerpage">
          <h1 className="text-center mb-4">Update Video</h1>
          <form onSubmit={handleSubmit} className="mt-5 formUpdate">
            <div className="mb-3">
              <label className="form-label">Title:</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description:</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Thumbnails Section */}
            <div className="mb-3">
              <label className="form-label">Existing Thumbnails:</label>
              <div className="d-flex flex-wrap">
                {thumbnails.map((thumbnail, index) => (
                  <div key={index} className="position-relative me-2 mb-2">
                    <img
                      src={
                        typeof thumbnail === "string"
                          ? thumbnail
                          : URL.createObjectURL(thumbnail)
                      }
                      alt={`thumbnail-${index}`}
                      className="img-thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0"
                      onClick={() => handleDeleteThumbnail(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <label className="form-label mt-2">Add New Thumbnails:</label>
              <input
                type="file"
                name="thumbnails"
                className="form-control"
                accept="image/jpeg, image/png"
                multiple
                ref={thumbnailsInputRef}
                onChange={handleFileChange}
              />
            </div>

            {/* Videos Section */}
            <div className="mb-3">
              <label className="form-label">Existing Videos:</label>
              <div className="d-flex flex-wrap">
                {videos.map((video, index) => (
                  <div key={index} className="position-relative me-2 mb-2">
                    <video
                      src={
                        typeof video === "string"
                          ? video
                          : URL.createObjectURL(video)
                      }
                      controls
                      className="me-2 mb-2"
                      style={{ width: "150px", height: "100px" }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0"
                      onClick={() => handleDeleteVideo(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <label className="form-label mt-2">Add New Videos:</label>
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
            </div>

            <button
              type="submit"
              className="btn-update w-75"
              disabled={loading}
            >
              <span>{loading ? "Updating..." : "Update"}</span>
            </button>
          </form>

          {success && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
              role="dialog"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content modelContent">
                  <div className="modal-header">
                    <h5 className="modal-title">Success</h5>
                    <button
                      type="button"
                      className="close closeModel"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={() => setSuccess(null)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>{success}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdatePage;
