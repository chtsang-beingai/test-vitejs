import PropTypes from 'prop-types';

import { useMediaRecorder } from "../hooks/media";

const MediaRecorder = ({ devices }) => {
  const media = useMediaRecorder();

  return (
    <>
      <div>ready: {`${media.state.ready}`}</div>
      <div>
        {media?.inputDevices?.length > 0 && (
          <select
            value={media.selectedDeviceId || ""}
            onChange={(event) => media.selectAudioDevice({ deviceId: event.target.value })}
          >
            {media?.inputDevices?.map((device) => {
              return (
                <option
                  key={device.deviceId}
                  value={device.deviceId}
                >
                  {device.label}
                </option>
              );
            })}
          </select>
        )}
      </div>
      <button
        onClick={media.init}
        style={{ marginRight: '4px' }}
        disabled={media.state.ready}>
        Init
      </button>
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