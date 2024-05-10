import mp3file from "./assets/outfoxing.mp3";
import { useAudio } from "./audio/hooks";
import { useMediaRecorder } from "./media/hooks";
import { useBrowserAsr } from "./speech/hooks";

const audioContext = new AudioContext();

const AudioSpeech = () => {
  const audio = useAudio({ path: mp3file, audioContext });
  const asr = useBrowserAsr({ locale: "en-US" });
  const media = useMediaRecorder();

  return <div>
    <h1>AudioSpeech Test</h1>

    <hr />
    <h2>AudioContext</h2>
    <button onClick={audio.play} style={{ marginRight: '4px' }}>Play</button>
    <button
      onClick={audio.stop}
      style={{ marginRight: '4px' }}
      disabled={!audio.state.isPlaying}>
      Stop
    </button>

    <hr />
    <h2>SpeechRecognition</h2>
    {!asr.state?.ready && <div>(Not supported)</div>}
    <button
      onClick={asr.start}
      style={{ marginRight: '4px' }}
      disabled={asr.state.isLoading || !asr.state.ready}>
      Start
    </button>
    <button
      onClick={asr.stop}
      style={{ marginRight: '4px' }}
      disabled={!asr.state.isLoading || !asr.state.ready}>
      Stop
    </button>
    <button
      onClick={asr.abort}
      style={{ marginRight: '4px' }}
      disabled={!asr.state.isLoading || !asr.state.ready}>
      Abort
    </button>
    {asr.state?.result &&
      (
        <div>
          result: {asr.state.result} (isFinal={`${asr.state.isFinal}`})
        </div>
      )
    }

    <hr />
    <h2>MediaRecorder</h2>
    <div>ready: {`${media.state.ready}`}</div>
    <button
      onClick={media.init}
      style={{ marginRight: '4px' }}
      disabled={media.state.ready}>
      Init
    </button>
    <button
      onClick={media.start}
      style={{ marginRight: '4px' }}
      disabled={media.state.isRecording || !media.state.ready}>
      Start
    </button>
    <button
      onClick={media.stop}
      style={{ marginRight: '4px' }}
      disabled={!media.state.isRecording || !media.state.ready}>
      Stop
    </button>
    {media.state?.audioUrl &&
      <>
        <div>audioUrl: {media.state.audioUrl}</div>
        <audio src={media.state.audioUrl} controls />
      </>
    }
  </div>
};

export default AudioSpeech;