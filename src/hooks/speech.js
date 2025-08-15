import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_LOCALE = "en-US";

const useBrowserAsr = ({ autoInit = false, locale = DEFAULT_LOCALE, setLogs = () => {} }) => {
  const [ready, setReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false); // event.results[0].isFinal
  const [result, setResult] = useState(null);
  const [asr, setAsr] = useState(null);

  const _log = useCallback((message) => {
    const ts = new Date().toISOString();
    setLogs((prevLogs) => [...prevLogs, `${ts} - ${message}`]);
  }, [setLogs
]);

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
    _log(`DEBUG: SpeechRecognition: 
      processLocally=${recognition.processLocally} | 
      lang=${recognition.lang} |
      available=${recognition.available} |
      install=${recognition.install}
    `);

    recognition.onerror = (event) => {
      _log(`onerror: ${event.error} | ${JSON.stringify(event)}`);
      console.error(`Speech recognition error detected: ${event.error}`);
    };
    
    recognition.onstart = () => {
      _log(`onstart`);
      setIsLoading(true);
    };

    recognition.onend = () => {
      _log(`onend`);
      setIsLoading(false);
    };

    recognition.onspeechstart = () => {
      _log(`onspeechstart`);
      setIsLoading(true);
    };

    recognition.onspeechend = () => {
      _log(`onspeechend`);
      setIsLoading(false);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      const final = !!event?.results[0]?.isFinal;
      _log(`onresult: result=${result} isFinal=${final}`);
      setIsFinal(final);
      setResult(result);
      
      if (final) {
        recognition.stop();
      }
    };

    setReady(true);
    setAsr(recognition);

    return recognition;
  }, [_log, locale]);

  const init = useCallback(() => {
    _log(`DEBUG: init`);
    setAsr(_initAsr());
  }, [_initAsr, _log]);

  const start = useCallback(() => {
    if (!asr) return;

    console.log('asr.start');
    _log(`DEBUG: start`);
    if (isLoading) {
      _log(`DEBUG: start: abort`);
      asr.abort();
    }
    _resetState();
    setTimeout(() => asr.start(), 0);
  }, [asr, isLoading, _resetState, _log]);

  const stop = useCallback(() => {
    if (!asr) return;

    console.log('asr.stop');
    _log(`DEBUG: stop`);
    asr.stop();
  }, [asr, _log]);

  const abort = useCallback(() => {
    if (!asr) return;

    console.log('asr.abort');
    _log(`DEBUG: abort`);
    asr.abort();
    _resetState();
  }, [asr, _resetState, _log]);

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
