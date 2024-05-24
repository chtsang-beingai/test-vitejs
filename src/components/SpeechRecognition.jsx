import { useBrowserAsr } from '../hooks/speech';

const SpeechRecognition = () => {
  const asr = useBrowserAsr({ locale: "en-US" });

  return (
    <>
      {!asr.state?.ready && <div>(Not supported)</div>
      }
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
      {
        asr.state?.result &&
        (
          <div>
            result: {asr.state.result} (isFinal={`${asr.state.isFinal}`})
          </div>
        )
      }
    </>
  );
};

export default SpeechRecognition;