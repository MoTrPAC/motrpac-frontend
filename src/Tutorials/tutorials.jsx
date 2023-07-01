import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IframeResizer from 'iframe-resizer-react';
import PageTitle from '../lib/ui/pageTitle';

function Tutorials() {
  const [videoHeight, setVideoHeight] = useState('480px');
  const iframeRef = useRef(null);

  useEffect(() => {
    const el = document.querySelector('#iframe-container');
    setVideoHeight(((el.scrollWidth - 30) / 16) * 9 + 'px');
  }, []);

  return (
    <div className="tutorialsPage px-3 px-md-4 mb-3 container">
      <PageTitle title="Tutorials" />
      <div className="main-study-container">
        <div className="main-study-summary-container row mb-4">
          <div className="col-12">
            <p className="lead">
              The following tutorial video is designed to help you get started
              with the MoTrPAC study and the exploration of the Data Hub. Please
              reach out to us with any{' '}
              <Link to="/contact">questions or comments</Link>.
            </p>
          </div>
          <div className="col-12" id="iframe-container">
            <IframeResizer
              forwardRef={iframeRef}
              heightCalculationMethod="max"
              widthCalculationMethod="max"
              allow="autoplay"
              src="https://drive.google.com/file/d/1dYoqYmN5RVk8Spyp2c-bxP5R7WA73Zag/preview"
              style={{
                height: videoHeight,
                width: '1px',
                minWidth: '100%',
                border: '1px solid #000',
              }}
              autoResize
              scrolling
              sizeHeight
              sizeWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorials;
