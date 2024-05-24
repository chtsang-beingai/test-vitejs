import { useCallback, useState } from 'react';
import bcp47 from '../assets/bcp47.json';
import { useBrowserAsr } from '../hooks/speech';

const SpeechRecognition = () => {
  const [locale, setLocale] = useState("en-US");
  const asr = useBrowserAsr({ locale });

  const onChangeLocale = useCallback((event) => {
    const newLocale = bcp47.find((item) => item.locale === event.target.value);
    if (!newLocale) return;
    setLocale(newLocale.locale);
  }, []);

  return (
    <>
      {!asr.state?.ready && <div>(Not supported)</div>}
      <div>
        <input
          type="text"
          list="locales"
          defaultValue={locale}
          onChange={onChangeLocale}
          style={{ minWidth: 200, marginBottom: 4 }}
        />
        <datalist id="locales">
          {bcp47.map((item) => {
            return (
              <option key={item.locale} value={item.locale}>{item.language} - {item.description}</option>
            );
          })}
        </datalist>
      </div>
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