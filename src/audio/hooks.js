import { useCallback, useEffect, useMemo, useState } from "react";

const useAudio = ({ audioContext, path, arrayBuffer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffer, setBuffer] = useState(null);
  const [source, setSource] = useState(null);
  const context = useMemo(() => audioContext || new AudioContext(), [audioContext]);

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

export { useAudio };

