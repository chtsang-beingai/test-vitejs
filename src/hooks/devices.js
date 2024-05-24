import { useCallback, useEffect, useMemo, useState } from "react";

const useAudioDevices = () => {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [inputDevices, setInputDevices] = useState([]);
  const [outputDevices, setOutputDevices] = useState([]);
  const [inputDevice, setInputDevice] = useState(null); 
  const [outputDevice, setOutputDevice] = useState(null);

  if (!navigator.mediaDevices) {
    console.error("navigator.mediaDevices is not supported");
  }

  useEffect(() => {
    const constraints = { audio: true, video: false };
    setLoading(true);
    navigator.mediaDevices.getUserMedia(constraints)
      .then(() => {
        return navigator.mediaDevices.enumerateDevices().then((devices) => {
          const inputs = devices.filter((device) => device.kind === "audioinput" && device.deviceId !== "default");
          const outputs = devices.filter((device) => device.kind === "audiooutput" && device.deviceId !== "default");
          setInputDevices(inputs);
          setOutputDevices(outputs);
          setInputDevice(inputs[0]);
          setOutputDevice(outputs[0]);
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
    const device = inputDevices.find((device) => device.deviceId === deviceId);
    if (device) {
      setInputDevice(device);
    }
  }, [inputDevices]);

  const selectOutputDevice = useCallback(({ deviceId, refresh = false }) => {
    let outputs = outputDevices;
    if (refresh) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const _outputs = devices.filter((device) => device.kind === "audiooutput" && device.deviceId !== "default");
        setOutputDevices(_outputs);
        outputs = _outputs;
      });
    }
    const device = outputs.find((device) => device.deviceId === deviceId);
    if (device) {
      setOutputDevice(device);
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
