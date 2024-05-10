import { useCallback, useState } from "react";

const AUDIO_FORMATS = [
  'audio/webm;codecs="opus"',
  "audio/webm",
  'audio/ogg;codecs="opus"',
  "audio/ogg",
  "audio/mp4",
];
const AUDIO_SUPPORTED = AUDIO_FORMATS.filter((fmt) =>  MediaRecorder.isTypeSupported(fmt));

const useMediaRecorder = () => {
  const [ready, setReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  if (!navigator.mediaDevices) {
    console.error("navigator.mediaDevices is not supported");
  }
  if (AUDIO_SUPPORTED.length === 0) {
    console.error("No supported audio formats found");
  }

  const _resetState = useCallback(() => {
    setAudioUrl(null);
    setIsRecording(false);
  }, []);

  const init = useCallback(() => {
    const constraints = { audio: true, video: false };
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
          console.log("recorder.onstop", {url});
          setAudioUrl(url);
          chunks = []
        };

        setMediaRecorder(recorder);
      })
      .then(() => setReady(true));
  }, []);

  const start = useCallback(() => {
    _resetState();
    mediaRecorder.start();
    setIsRecording(true);
  }, [mediaRecorder, _resetState]);

  const stop = useCallback(() => {
    mediaRecorder.stop();
    setIsRecording(false);
  }, [mediaRecorder]);

  return { init, start, stop, state: { ready, isRecording, audioUrl }};
};

export { useMediaRecorder };
