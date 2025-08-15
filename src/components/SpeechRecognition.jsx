import { useCallback, useEffect, useRef, useState } from 'react';
import bcp47 from '../assets/bcp47.json';
import { useBrowserAsr } from '../hooks/speech';

const SpeechRecognition = () => {
  const endRef = useRef();

  const [locale, setLocale] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isMax, setIsMax] = useState(false);

  const asr = useBrowserAsr({ locale, setLogs });

  const onChangeLocale = useCallback((event) => {
    const newLocale = bcp47.find((item) => item.locale === event.target.value);
    if (!newLocale) {
      setLocale(null);
    } else {
      setLocale(newLocale.locale);
    }
  }, []);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <>
      {!asr.state?.ready && <div>(Pick a locale, then click button &quot;Init&quot;.)</div>}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: "baseline", gap: 4 }}>
        <input
          type="text"
          list="locales"
          value={locale || ''}
          onChange={onChangeLocale}
          style={{ minWidth: 240, marginBottom: 4 }}
          placeholder='Select or enter to search a locale'
          disabled={asr.state.ready}
        />
        <datalist id="locales">
          {bcp47.map((item) => {
            return (
              <option key={item.locale} value={item.locale}>{item.language} - {item.description}</option>
            );
          })}
        </datalist>
        <button onClick={() => setLocale("en-US")} disabled={asr.state.ready}>en-US</button>
      </div>
      <button
        onClick={asr.init}
        style={{ marginRight: '4px' }}
        disabled={!locale || asr.state.ready}>
        Init
      </button>
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
            result: {asr.state?.result} (isFinal={`${asr.state?.isFinal}`})
          </div>
        )
      }
      <div style={{
        height: 100,
        overflowY: 'auto',
        border: '1px solid lightgray',
        position: 'relative',
        borderRadius: 5,
        marginTop: 4,
        padding: 2,
        fontSize: '0.8em',
        ...(
          isMax && {
            position: 'fixed',
            top: 8,
            right: 8,
            minWidth: 300,
            width: '50%',
            minHeight: 200,
            height: '40%',
            background: 'black',
          }),
      }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-end'
          }}
        >
          <button
            style={{ cursor: "pointer", margin: 4, }}
            onClick={() => setIsMax((prev) => !prev)}
            title="Toggle Maximize">
            {isMax ? '<' : '^'}
          </button>
          <button
            style={{ cursor: "pointer", margin: 4, marginRight: 4 }}
            onClick={() => setLogs([])}
            title="Clear">
            X
          </button>
        </div>
        {
          logs.map((item, index) => {
            return (
              <div key={index}>{item}</div>
            );
          })
        }
        <div ref={endRef} />
      </div >
    </>
  );
};

export default SpeechRecognition;