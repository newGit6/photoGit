import React, { useState, useCallback } from "react";
import "./UserHome.css"; // Import your CSS file
import axios from "axios";
import { debounce } from "lodash"; // Use lodash for debouncing
import UserNav from "../userNav/UserNav";

const UserHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Define the search function
  const performSearch = async (query) => {
    if (query.trim() === "") {
      setVideos([]); // Clear videos if query is empty
      return;
    }

    try {
      const response = await axios.get("http://localhost:4563/api/videos", {
        params: { title: query },
      });

      // Filter videos to only include those whose titles start with the search query
      const filteredVideos = response.data.filter((video) =>
        video.title.toLowerCase().startsWith(query.toLowerCase())
      );

      setVideos(filteredVideos);
      setSelectedVideo(null); // Reset selected video on new search
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  // Create a debounced version of the search function
  const debouncedSearch = useCallback(debounce(performSearch, 300), []);

  // Handle input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSelectVideo = async (videoId) => {
    try {
      const response = await axios.get(
        `http://localhost:4563/api/videos/${videoId}`
      );
      setSelectedVideo(response.data);
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setVideos([]);
    setSelectedVideo(null);
  };

  return (
    <>
      <UserNav />
      <div className="container-fluid containerasfluid">
        <div className="container containeras">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Title..."
              className="search-bar"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button className="clear-button" onClick={handleClearSearch}>
                Clear
              </button>
            )}
          </div>

          <div className="results-container">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div key={video._id} className="video-items">
                  <h3 style={{ fontSize: "25px" }}>
                    {" "}
                    Title: <span>{video.title}</span>{" "}
                  </h3>
                  <button
                    className="select-button"
                    onClick={() => handleSelectVideo(video._id)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p>No videos found.</p>
            )}
          </div>

          {selectedVideo && (
            <div className="video-details">
              <h2>
                {" "}
                <span>Title Name: </span>
                {selectedVideo.title}
              </h2>
              <p style={{ fontSize: "20px" }}>
                {" "}
                <span>Description: </span>
                {selectedVideo.description}
              </p>
              <div>
                <strong>Images:</strong>
                <ul style={{ listStyleType: "none" }}>
                  {selectedVideo.thumbnails.map((thumbnail, index) => (
                    <li key={index}>
                      <img
                        src={`http://localhost:4563/uploads/${thumbnail}`}
                        alt={`Thumbnail ${index}`}
                        width="100"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Videos:</strong>
                <ul style={{ listStyleType: "none" }}>
                  {selectedVideo.videos.map((video, index) => (
                    <li key={index}>
                      <video
                        controls
                        src={`http://localhost:4563/uploads/${video}`}
                        width="320"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserHome;
