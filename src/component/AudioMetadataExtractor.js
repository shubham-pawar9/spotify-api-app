import React, { useState } from "react";
import * as mm from "music-metadata-browser";

const AudioMetadataExtractor = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      try {
        const metadata = await mm.parseBlob(selectedFile);
        // const metadata = await mm.fetchFromUrl(selectedFile);
        console.log(metadata);
        setMetadata(metadata.common);
      } catch (error) {
        console.error("Error extracting metadata:", error.message);
      }

      setFile(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" accept=".mp3" onChange={handleFileChange} />
      {file && (
        <div>
          <h2>File Details:</h2>
          <p>Singer: {metadata?.artist || "Unknown"}</p>
          <p>Album: {metadata?.album || "Unknown"}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default AudioMetadataExtractor;
