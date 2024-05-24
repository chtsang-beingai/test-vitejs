import PropTypes from 'prop-types';
import { useMemo } from 'react';
import mp3file from "../assets/outfoxing.mp3";
import { useAudio } from "../hooks/audio";

const AudioContext = ({ devices }) => {
  const audio = useAudio({ path: mp3file, deviceId: devices.outputDevice });

  const deviceLabel = useMemo(() => {
    return devices.outputDevices.find((device) => device.deviceId === devices.outputDevice)?.label;
  }, [devices.outputDevice, devices.outputDevices]);

  return (
    <>
      <h4>Output: {deviceLabel}</h4>
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