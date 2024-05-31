
import PropTypes from 'prop-types';
import { useCallback } from 'react';

const DeviceSelection = ({ devices, showInput = true, showOutput = true }) => {

  const selectAudioOutput = useCallback(() => {
    if (navigator.mediaDevices?.selectAudioOutput) {
      // only available in Firefox at the moment
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/selectAudioOutput
      navigator.mediaDevices
        .selectAudioOutput()
        .then((device) => {
          devices.selectOutputDevice({ deviceId: device.deviceId, refresh: true });
          console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`);
        });
    }
  }, [devices]);

  return (
    <>
      {showInput && (
        <div>
          <span style={{ display: 'inline-block', minWidth: 60 }}>Input: </span>
          <select
            value={devices.inputDevice?.deviceId || "none"}
            onChange={(event) => devices.selectInputDevice({ deviceId: event.target.value })}
          >
            {devices?.inputDevices?.length === 0 && (
              <option value='none'>None</option>
            )}
            {devices?.inputDevices?.map((device) => {
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
        </div >
      )}
      {
        showOutput && (
          <div>
            <span style={{ display: 'inline-block', minWidth: 60 }}>Output: </span>
            <select
              value={devices.outputDevice?.deviceId || "none"}
              onChange={(event) => devices.selectOutputDevice({ deviceId: event.target.value })}
            >
              {devices?.outputDevices?.length === 0 && (
                <option value='none'>None</option>
              )}
              {devices?.outputDevices?.map((device) => {
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
          </div>
        )
      }
      {navigator.mediaDevices?.selectAudioOutput && (
        <button onClick={() => selectAudioOutput()}>Select Audio Output</button>
      )}
    </>
  );
};

DeviceSelection.propTypes = {
  devices: PropTypes.object.isRequired,
  showInput: PropTypes.bool,
  showOutput: PropTypes.bool,
};

export default DeviceSelection;