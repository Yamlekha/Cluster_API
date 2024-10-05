import React, { useState } from "react";
import axios from "axios";
import "./ClusterDocuments.css"; 

const ClusterDocuments = () => {
  const [nClusters, setNClusters] = useState(5); // Default cluster value
  const [file, setFile] = useState(null); // PDF file state
  const [clusters, setClusters] = useState([]); // Store clusters from API
  const [wordClouds, setWordClouds] = useState({}); // Store word clouds from API

  // Handle file input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("files", file); // Add PDF file
    formData.append("n_clusters", nClusters); // Add number of clusters

    try {
      const response = await axios.post(
        "https://cluster-poc-4ba2ee28df2f.herokuapp.com/cluster-documents/",
        formData
      );

      setClusters(response.data.clusters); // Set clusters in state
      setWordClouds(response.data.wordclouds); // Set word clouds in state
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div className="container"> {/* Centering wrapper */}
      <h1>Smart Resume Analizer</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nClusters">Number of Clusters :</label>
        <input
          type="number"
          id="nClusters"
          value={nClusters}
          onChange={(e) => setNClusters(e.target.value)}
          min="1"
        />
        <br />
        <label htmlFor="file">Upload Document PDF:</label>
        <input
          type="file"
          id="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {/* Display Clusters */}
      {clusters.length > 0 && (
        <div>
          <h2>Clusters</h2>
          {clusters.map((cluster, index) => (
            <div key={index}>
              <h3>Cluster {cluster.cluster}</h3>
              <ul>
                {cluster.topics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Display Word Clouds */}
      {Object.keys(wordClouds).length > 0 && (
        <div>
          <h2>Word Clouds</h2>
          {Object.keys(wordClouds).map((key) => (
            <div key={key}>
              <h3>{key}</h3>
              <img
                src={`data:image/png;base64,${wordClouds[key]}`}
                alt={`Word Cloud for ${key}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClusterDocuments;
