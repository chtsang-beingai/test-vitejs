
const oggUrl = "/test-vitejs/test.ogg";
const mp3Url = "/test-vitejs/test.mp3";
const aacUrl = "/test-vitejs/test.aac";

const OggAudioTest = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const playBuffer = (buffer) => {
    let source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.loop = false;
    source.start();
  }

  const loadAudioFile = async (url) => {
    try {
      const response = await fetch(url);
      audioContext.decodeAudioData(await response.arrayBuffer(), playBuffer);
    } catch (err) {
      console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
  }

  return (
    <>
      <div><button onClick={() => loadAudioFile(oggUrl)}>Play OGG</button></div>
      <div><button onClick={() => loadAudioFile(mp3Url)}>Play MP3</button></div>
      <div><button onClick={() => loadAudioFile(aacUrl)}>Play AAC</button></div>
      <div>File: <a href={oggUrl} target="_blank">test.ogg</a></div>
      <div>File: <a href={mp3Url} target="_blank">test.mp3</a></div>
      <div>File: <a href={aacUrl} target="_blank">test.aac</a></div>
    </>
  );

};

export default OggAudioTest;