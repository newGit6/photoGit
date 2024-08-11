import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Pages/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";
import { FaWindowClose } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null); // For modal content
  const [modalVisible, setModalVisible] = useState(false); // To show/hide modal
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 }); 
  }, []);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `https://photoshopbackend-079t.onrender.com/api/videos/${id}`
        );
        setVideo(response.data);
      } catch (err) {
        setError("Error fetching video details");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleOpenModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalContent(null);
    setModalVisible(false);
  };

  // Delete functions
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://photoshopbackend-079t.onrender.com/api/videos/${id}`);
      setVideo(null); // Assuming you want to clear the video details on successful delete
      navigate("/webpage1");
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

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="container-fluid viewDetailes">
        <div className="container">
          {video && (
            <div className="p-5">
              <div className="d-flex justify-content-between mb-3">
                <div className="btnView">
                  <Link to="/webpage1" className="backViewBtn">
                    <IoMdArrowRoundBack />
                  </Link>
                </div>
                <div className="p-2">
                  <p className="text-center viewTitle">
                    <strong>Title : </strong> <span>{video.title}</span>
                  </p>
                </div>
                <div className="p-2">
                  <div className="btn-group">
                    <Link to={`/update/${id}`} className="btn btn-primary">
                      <FaEdit size={25} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(video._id)}
                      className="btn btn-danger"
                    >
                      <MdDeleteSweep size={25} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="gallery-th mt-3">
                {video.thumbnails.map((thumbnail, index) => (
                  <img
                    key={index}
                    src={`https://photoshopbackend-079t.onrender.com/uploads/${thumbnail}`}
                    alt={`Thumbnail ${index}`}
                    className="gallery-img"
                    data-aos="fade-right"
                    data-aos-duration="3000"
                    onClick={() =>
                      handleOpenModal(
                        `https://photoshopbackend-079t.onrender.com/uploads/${thumbnail}`
                      )
                    }
                  />
                ))}
              </div>
              <div className="gallery-vs mt-3">
                {video.videos.map((videoFile, index) => (
                  <video
                    key={index}
                    controls
                    src={`https://photoshopbackend-079t.onrender.com/uploads/${videoFile}`}
                    className="gallery-video"
                    data-aos="fade-left"
                    data-aos-duration="3000"
                    onClick={() =>
                      handleOpenModal(
                        `https://photoshopbackend-079t.onrender.com/uploads/${videoFile}`
                      )
                    }
                  >
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for image/video */}
      {modalVisible && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modalContent.endsWith(".mp4") ? (
              <video
                controls
                src={modalContent}
                style={{ width: "100%", height: "auto" }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={modalContent}
                alt="Expanded"
                style={{ width: "100%", height: "auto" }}
              />
            )}
            <button className="close-modal" onClick={handleCloseModal}>
              <FaWindowClose />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content modelContent">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="close closeModel"
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
    </>
  );
};

export default VideoDetail;
