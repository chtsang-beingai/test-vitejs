import { useCallback, useMemo, useState } from "react";

const useBrowserAsr = ({ locale }) => {
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
      setIsFinal(!!event?.results[0]?.isFinal);
      setResult(result);
    };

    return recognition;
  }, [locale]);

  const start = useCallback(() => {
    console.log('asr.start');
    if (isLoading) {
      asr.abort();
    }
    _resetState();
    setTimeout(() => asr.start(), 0);
  }, [isLoading, _resetState, asr]);

  const stop = useCallback(() => {
    console.log('asr.stop');
    asr.stop();
  }, [asr]);

  const abort = useCallback(() => {
    console.log('asr.abort');
    asr.abort();
    _resetState();
  }, [asr, _resetState]);

  return { start, stop, abort, state: { result, isFinal, isLoading } };
};

export { useBrowserAsr };

