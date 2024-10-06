import React, { useState } from "react";
import axios from "axios";
import "./ClusterDocuments.css";

const ClusterDocuments = () => {
  const [nClusters, setNClusters] = useState(5); 
  const [file, setFile] = useState(null); 
  const [clusters, setClusters] = useState([]); 
  const [wordClouds, setWordClouds] = useState({}); 
  const [loading, setLoading] = useState(false); 

  // Handle file input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("files", file); 

    setLoading(true); 
    try {
      
      const response = await axios.post(
        `https://cluster-poc-4ba2ee28df2f.herokuapp.com/cluster-documents/?n_clusters=${nClusters}`, 
        formData
      );

      setClusters(response.data.clusters); 
      setWordClouds(response.data.wordclouds); 
    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container">
      <div className="form-container"> 
        <h1>Smart Resume Analyzer</h1>
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
          <button type="submit" disabled={loading}> 
            {loading ? 'Loading...' : 'Submit'} 
          </button>
        </form>
      </div>

      
      <div className="flex-container">
        
        {clusters.length > 0 && (
          <div className="clusters">
            <h2>Clusters</h2>
            {clusters.map((cluster, index) => (
              <div className="cluster-container" key={index}>
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

       
        {Object.keys(wordClouds).length > 0 && (
          <div className="word-clouds">
            <h2>Word Clouds</h2>
            {Object.keys(wordClouds).map((key) => (
              <div className="word-cloud-container" key={key}>
                <h3>{key}</h3>
                <img
                  className="word-cloud-image"
                  src={`data:image/png;base64,${wordClouds[key]}`}
                  alt={`Word Cloud for ${key}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClusterDocuments;
