import { useCallback, useEffect, useMemo, useState } from "react";

const useAudio = ({ path, arrayBuffer, deviceId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffer, setBuffer] = useState(null);
  const [source, setSource] = useState(null);

  const context = useMemo(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }, []);

  useEffect(() => {
    if (path) {
      fetch(path)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => setBuffer(audioBuffer));
    } else if (arrayBuffer) {
      context.decodeAudioData(arrayBuffer)
        .then((audioBuffer) => setBuffer(audioBuffer));
    }
  }, [context, path, arrayBuffer]);

  useEffect(() => {
    if (!deviceId) return;

    const _wrapper = async () => await context.setSinkId(deviceId);
    _wrapper();
  }, [context, deviceId]);

  const play = useCallback(() => {
    if (source) {
      source.stop();
    }

    const bufferSource = context.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(context.destination);
    bufferSource.start(0);

    setIsPlaying(true);
    setSource(bufferSource);
  }, [source, buffer, context]);

  const stop = useCallback(() => {
    if (!source) return;

    source.stop();
    setIsPlaying(false);
  }, [source]);

  return { play, stop, state: { isPlaying } };
};

const useAudio2 = ({ path, arrayBuffer, deviceId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffer, setBuffer] = useState(null);

  const audioElem = useMemo(() => document.createElement("audio"), []);

  const context = useMemo(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }, []);

  useEffect(() => {
    if (path) {
      fetch(path)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => setBuffer(audioBuffer));
    } else if (arrayBuffer) {
      context.decodeAudioData(arrayBuffer)
        .then((audioBuffer) => setBuffer(audioBuffer));
    }
  }, [context, arrayBuffer, path]);

  useEffect(() => {
    if (!deviceId) return;
    if (!audioElem.setSinkId) return;

    const _wrapper = async () => await audioElem.setSinkId(deviceId);
    _wrapper();
  }, [audioElem, deviceId]);

  const play = useCallback(() => {
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    const objectUrl = window.URL.createObjectURL(blob);
    console.log("play", {objectUrl});
    audioElem.src = objectUrl;
    audioElem.load();
    audioElem.onload = () => {
      audioElem.play().then(() => console.log("played")).catch((e) => console.error('play error', e));
      // window.URL.revokeObjectURL(objectUrl);
    };
    setIsPlaying(true);
  }, [audioElem, buffer]);

  const stop = useCallback(() => {
    audioElem.pause();
    audioElem.currentTime = 0;
    audioElem.src = "";
    setIsPlaying(false);
  }, [audioElem]);
  
  return { play, stop, state: { isPlaying } };
};

export { useAudio, useAudio2 };

