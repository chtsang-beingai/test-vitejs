import { useCallback, useEffect, useMemo, useState } from "react";

const AUDIO_FORMATS = [
  'audio/webm;codecs="opus"',
  "audio/webm",
  'audio/ogg;codecs="opus"',
  "audio/ogg",
  "audio/mp4",
];
const AUDIO_SUPPORTED = AUDIO_FORMATS.filter((fmt) =>  MediaRecorder.isTypeSupported(fmt));

const useMediaRecorder = ({ devices }) => {
  const [ready, setReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  if (AUDIO_SUPPORTED.length === 0) {
    console.error("No supported audio formats found");
  }

  const _resetState = useCallback(() => {
    setAudioUrl(null);
    setIsRecording(false);
  }, []);

  useEffect(() => {
    if (!devices.inputDevice) return;
    setReady(false);

    const constraints = {
      audio: true,
      video: false,
      deviceId: devices.inputDevice.deviceId,
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        let chunks = [];

        recorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: AUDIO_SUPPORTED[0] });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          chunks = []
        };

        setMediaRecorder(recorder);
      })
      .then(() => setReady(true));
      
  }, [devices.inputDevice])

  const start = useCallback(() => {
    _resetState();
    mediaRecorder.start();
    setIsRecording(true);
  }, [mediaRecorder, _resetState]);

  const stop = useCallback(() => {
    mediaRecorder.stop();
    setIsRecording(false);
  }, [mediaRecorder]);

  const value = useMemo(() => ({
    start, stop,
    state: { ready, isRecording, audioUrl },
  }), [audioUrl, isRecording, ready, start, stop]);

  return value;
};

export { useMediaRecorder };
