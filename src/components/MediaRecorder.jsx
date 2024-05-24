import PropTypes from 'prop-types';

import { useMemo } from 'react';
import { useMediaRecorder } from "../hooks/media";

const MediaRecorder = ({ devices }) => {
  const media = useMediaRecorder({ devices });

  const deviceLabel = useMemo(() => {
    return devices.inputDevice?.label || 'None';
  }, [devices.inputDevice]);

  return (
    <>
      <div>Input: <span style={{ fontWeight: 700 }}>{deviceLabel}</span></div>
      <div>Ready: {`${media.state.ready}`}</div>
      <button
        onClick={media.start}
        style={{ marginRight: '4px' }}
        disabled={media.state.isRecording || !media.state.ready}>
        Start
      </button>
      <button
        onClick={media.stop}
        style={{ marginRight: '4px' }}
        disabled={!media.state.isRecording || !media.state.ready}>
        Stop
      </button>
      {media.state?.audioUrl &&
        <>
          <div>audioUrl: {media.state.audioUrl}</div>
          <audio src={media.state.audioUrl} controls />
        </>
      }
    </>
  );
};

MediaRecorder.propTypes = {
  devices: PropTypes.object.isRequired,
};

export default MediaRecorder;