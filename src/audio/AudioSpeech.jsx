import { useEffect } from "react";
import mp3file from "../assets/outfoxing.mp3";
import { useBrowserAsr } from "../speech/hooks";
import { useAudio } from "./hooks";

const audioContext = new AudioContext();

const AudioSpeech = () => {
  const audio = useAudio({ path: mp3file, audioContext });
  const asr = useBrowserAsr({ locale: "en-US" });

  useEffect(() => {
    if (asr.state.isFinal) {
      asr.stop();
    }
  }, [asr, asr.state.isFinal])

  console.log('asr', asr.state);

  return <div>
    <h1>AudioSpeech Test</h1>
    <hr />

    <h2>Audio</h2>
    <button onClick={audio.play} style={{ marginRight: '4px' }}>Play</button>
    <button
      onClick={audio.stop}
      style={{ marginRight: '4px' }}
      disabled={!audio.state.isPlaying}>
      Stop
    </button>
    <hr />

    <h2>Speech</h2>
    <button
      onClick={asr.start}
      style={{ marginRight: '4px' }}
      disabled={asr.state.isLoading}>
      Start
    </button>
    <button
      onClick={asr.stop}
      style={{ marginRight: '4px' }}
      disabled={!asr.state.isLoading}>
      Stop
    </button>
    <button
      onClick={asr.abort}
      style={{ marginRight: '4px' }}
      disabled={!asr.state.isLoading}>
      Abort
    </button>
    {asr.state.isFinal &&
      (
        <div>
          result: {JSON.stringify(asr.state)}
        </div>
      )
    }
  </div>
};

export default AudioSpeech;