import { useCallback, useMemo, useState } from "react";

const AUDIO_FORMATS = [
  'audio/webm;codecs="opus"',
  "audio/webm",
  'audio/ogg;codecs="opus"',
  "audio/ogg",
  "audio/mp4",
];
const AUDIO_SUPPORTED = AUDIO_FORMATS.filter((fmt) =>  MediaRecorder.isTypeSupported(fmt));
const DEFAULT_LOCALE = "en-US";

const useBrowserAsr = ({ locale = DEFAULT_LOCALE }) => {
  const [ready, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false); // event.results[0].isFinal
  const [result, setResult] = useState(null);

  const _resetState = useCallback(() => {
    setIsFinal(false);
    setResult(null);
    setIsLoading(false);
  }, []);

  const asr = useMemo(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported");
      return null;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = locale;

    recognition.onerror = (event) => {
      console.error(`Speech recognition error detected: ${event.error}`);
    };
    
    recognition.onstart = () => {
      setIsLoading(true);
    };

    recognition.onend = () => {
      setIsLoading(false);
    };

    recognition.onspeechstart = () => {
      setIsLoading(true);
    };

    recognition.onspeechend = () => {
      setIsLoading(false);
    };

    recognition.onresult = (event) => {     
      const result = event.results[0][0].transcript;
      const final = !!event?.results[0]?.isFinal;
      setIsFinal(final);
      setResult(result);

      if (final) {
        asr.stop();
      }
    };

    setReady(true);

    return recognition;
  }, [locale]);

  const start = useCallback(() => {
    if (!asr) return;

    console.log('asr.start');
    if (isLoading) {
      asr.abort();
    }
    _resetState();
    setTimeout(() => asr.start(), 0);
  }, [isLoading, _resetState, asr]);

  const stop = useCallback(() => {
    if (!asr) return;

    console.log('asr.stop');
    asr.stop();
  }, [asr]);

  const abort = useCallback(() => {
    if (!asr) return;
    
    console.log('asr.abort');
    asr.abort();
    _resetState();
  }, [asr, _resetState]);

  return { start, stop, abort, state: { ready, result, isFinal, isLoading } };
};

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

export { useBrowserAsr, useMediaRecorder };

