import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Pages/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";

const WebPage1 = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:4563/api/videos");
        const userID = JSON.parse(localStorage.getItem("user"))?.id;
        const filteredVideos = response.data.filter(
          (video) => video.userID === userID
        );
        setVideos(filteredVideos);
        console.log(filteredVideos);
      } catch (err) {
        setError("Error fetching videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4563/api/videos/${id}`);
      setVideos(videos.filter((video) => video._id !== id));
      setShowConfirmDelete(false);
    } catch (err) {
      setError("Error deleting video");
    }
  };

  const handleDeleteClick = (id) => {
    setVideoToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setVideoToDelete(null);
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const handleThumbnailClick = (id) => {
    navigate(`/video/${id}`);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="container-allcards">
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4 titlevideos">Videos</h1>
        {videos.length === 0 ? (
          <p className="text-center">No videos available.</p>
        ) : (
          <div className="row gallery-grid">
            {videos.map((video) => {
              const thumbnails = video.thumbnails || [];
              const videosList = video.videos || [];

              return (
                <div
                  key={video._id}
                  className="col-md-12 mb-4"
                  data-aos="zoom-in"
                >
                  <div
                    className="card card-all"
                    style={{ backgroundColor: "#D7C49E" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title mx-5">
                        <strong>Title : </strong>
                        {video.title}
                      </h5>

                      <div className="text-center">
                        <p>
                          {" "}
                          <strong>Description : </strong> {video.description}
                        </p>
                      </div>

                      <div className="gallery-thumbnails mb-3 mt-5">
                        {thumbnails.length > 0 && (
                          <div className="gallery-grid">
                            {thumbnails.map((thumbnail, index) => (
                              <img
                                key={index}
                                src={`http://localhost:4563/uploads/${thumbnail}`}
                                alt={`thumbnail-${index}`}
                                className="gallery-item"
                                data-aos="zoom-in"
                                data-aos-duration="1000"
                                onClick={() => handleThumbnailClick(video._id)}
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-muted mt-2">
                          <strong>Images Count : </strong>
                          {thumbnails.length}
                        </p>
                      </div>

                      <div className="gallery-videos mb-3">
                        {videosList.length > 0 && (
                          <div className="gallery-grid">
                            {videosList.map((videoFile, index) => (
                              <video
                                key={index}
                                controls
                                src={`http://localhost:4563/uploads/${videoFile}`}
                                className="gallery-item"
                                data-aos="fade-up"
                                data-aos-duration="1000"
                                onClick={() => handleThumbnailClick(video._id)}
                              >
                                Your browser does not support the video tag.
                              </video>
                            ))}
                          </div>
                        )}
                        <p className="text-muted mt-2">
                          <strong>Videos Count: </strong> {videosList.length}
                        </p>
                      </div>

                      <div className="d-flex justify-content-between">
                        <button
                          onClick={() => handleDeleteClick(video._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bootstrap Modal for Confirmation */}
        {showConfirmDelete && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={handleCancelDelete}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this video?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(videoToDelete)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebPage1;
