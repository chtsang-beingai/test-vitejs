
import PropTypes from 'prop-types';

const DeviceSelection = ({ devices, showInput = true, showOutput = true }) => {
  return (
    <>
      {showInput && (
        <div>
          <span style={{ display: 'inline-block', minWidth: 60 }}>Input: </span>
          <select
            value={devices.inputDevice || "none"}
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
              value={devices.outputDevice || "none"}
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
    </>
  );
};

DeviceSelection.propTypes = {
  devices: PropTypes.object.isRequired,
  showInput: PropTypes.bool,
  showOutput: PropTypes.bool,
};

export default DeviceSelection;