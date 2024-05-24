import { useCallback, useEffect, useMemo, useState } from "react";

const useAudioDevices = () => {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [inputDevices, setInputDevices] = useState([]);
  const [outputDevices, setOutputDevices] = useState([]);
  const [inputDevice, setInputDevice] = useState(null); 
  const [outputDevice, setOutputDevice] = useState(null);

  useEffect(() => {
    const constraints = { audio: true, video: false };
    setLoading(true);
    navigator.mediaDevices.getUserMedia(constraints)
      .then(() => {
        return navigator.mediaDevices.enumerateDevices().then((devices) => {
          const inputs = devices.filter((device) => device.kind === "audioinput");
          const outputs = devices.filter((device) => device.kind === "audiooutput");
          setInputDevices(inputs);
          setOutputDevices(outputs);
          setInputDevice(inputs[0]?.deviceId);
          setOutputDevice(outputs[0]?.deviceId);
          setReady(true);
        });
      })
      .catch((error) => {      
        console.error("Error on getUserMedia", error);
        setReady(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const selectInputDevice = useCallback(({ deviceId }) => {
    if (inputDevices.find((device) => device.deviceId === deviceId)) {
      setInputDevice(deviceId);
    }
  }, [inputDevices]);

  const selectOutputDevice = useCallback(({ deviceId }) => {
    if (outputDevices.find((device) => device.deviceId === deviceId)) {
      setOutputDevice(deviceId);
    }
  }, [outputDevices]);

  const value = useMemo(() => ({
    loading,
    ready,
    inputDevice,
    inputDevices,
    outputDevice,
    outputDevices,
    selectInputDevice,
    selectOutputDevice,
  }), [
    loading, ready, inputDevice, inputDevices, outputDevice, outputDevices,
    selectInputDevice, selectOutputDevice,
  ])

  return value;
};

export { useAudioDevices };
