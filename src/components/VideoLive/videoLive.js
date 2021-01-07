import React, { PureComponent } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';

/**
 * @description Live 播放器
 */
class VideoPlayer extends PureComponent {
  componentDidMount() {
    this.props = {
      autoplay: true,
      controls: true,
      sources: [
        {
          src: this.props.src,
          type: 'application/x-mpegURL',
        },
      ],
    };
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });
    this.player.play();
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div data-vjs-player style={{ width: '100%', height: '100%' }}>
          <video
            muted
            ref={node => (this.videoNode = node)}
            className="video-js vjs-default-skin vjs-big-play-centered"
            style={{ objectFit: 'full' }}
            autoPlay="autoPlay"
          />
        </div>
      </div>
    );
  }
}

// className="video-js vjs-default-skin video"

export default VideoPlayer;
