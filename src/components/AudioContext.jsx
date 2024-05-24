import PropTypes from 'prop-types';
import { useMemo } from 'react';
import mp3file from "../assets/outfoxing.mp3";
import { useAudio } from "../hooks/audio";

const AudioContext = ({ devices }) => {
  const audio = useAudio({ path: mp3file, deviceId: devices.outputDevice?.deviceId });

  const deviceLabel = useMemo(
    () => devices.outputDevice?.label || 'None',
    [devices.outputDevice]
  );

  return (
    <>
      <div>Output: <span style={{ fontWeight: 700 }}>{deviceLabel}</span></div>
      <button onClick={audio.play} style={{ marginRight: '4px' }}>Play</button>
      <button
        onClick={audio.stop}
        style={{ marginRight: '4px' }}
        disabled={!audio.state.isPlaying}>
        Stop
      </button>
    </>
  );

};

AudioContext.propTypes = {
  devices: PropTypes.object.isRequired,
};

export default AudioContext;