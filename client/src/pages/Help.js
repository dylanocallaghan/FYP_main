import React from 'react';
import '../styles/Help.css';

const Help = () => {
  return (
    <div className="help-container">
      <h2>Student Help & Support</h2>
      <p>Need help using Student Housing Helper? Below are some quick guides to get you started.</p>

      <h2>🎥 How-To Videos</h2>

      <div className="video-section">
        <h3>How to Register</h3>
        <iframe 
          width="100%" 
          height="315" 
          src="https://www.youtube.com/embed/tJSI4WVgy08" 
          title="How to Register" 
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>

      <div className="video-section">
        <h3>How to Find Listings</h3>
        <iframe 
          width="100%" 
          height="315" 
          src="https://www.youtube.com/embed/EVsp2zGERnI" 
          title="How to Find Listings" 
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>

      <div className="video-section">
        <h3>How to Take the Compatibility Quiz</h3>
        <iframe 
          width="100%" 
          height="315" 
          src="https://www.youtube.com/embed/PeyuNrE157I" 
          title="Compatibility Quiz Guide" 
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Help;
