import React, { useRef, useEffect } from 'react';
import * as flvjs from 'flv.js/dist/flv';

const FlvLive = props => {
  const videoRef = useRef();
  const { src } = props;

  useEffect(() => {
    let flvPlayer = null;
    if (flvjs.isSupported()) {
      flvPlayer = flvjs.createPlayer(
        {
          cors: true,
          hasAudio: true,
          hasVideo: true,
          type: 'flv',
          url: src,
        },
        {
          seekType: 'range',
          enableWorker: false,
          lazyLoadMaxDuration: 3 * 60,
          fixAudioTimestampGap: false,
        },
      );
      flvPlayer.attachMediaElement(videoRef.current);
      flvPlayer.load();
    }
    return () => {
      if (flvPlayer) {
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
        flvPlayer = null;
      }
    };
  }, [src]);

  return (
    <video
      muted
      controls
      autoPlay="autoPlay"
      ref={videoRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

FlvLive.defaultProps = {
  src: '',
};

export default FlvLive;
