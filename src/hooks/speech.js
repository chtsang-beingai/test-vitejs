import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_LOCALE = "en-US";

const useBrowserAsr = ({ autoInit = false, locale = DEFAULT_LOCALE }) => {
  const [ready, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false); // event.results[0].isFinal
  const [result, setResult] = useState(null);
  const [asr, setAsr] = useState(null);

  const _resetState = useCallback(() => {
    setIsFinal(false);
    setResult(null);
    setIsLoading(false);
  }, []);

  const _initAsr = useCallback(() => {
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
        recognition.stop();
      }
    };

    setReady(true);
    setAsr(recognition);

    return recognition;
  }, [locale]);

  const init = useCallback(() => {
    setAsr(_initAsr());
  }, [_initAsr]);

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

  useEffect(() => {
    if (!autoInit) return;

    setAsr(_initAsr());
  }, [autoInit, _initAsr]);

  const value = useMemo(() => (
    { init, start, stop, abort, state: { ready, result, isFinal, isLoading } }
  ), [abort, isFinal, isLoading, ready, result, init, start, stop]);

  return value;
};

export { useBrowserAsr };
