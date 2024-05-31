import AudioContext from "../components/AudioContext";
import DeviceSelection from "../components/DeviceSelection";
import MediaRecorder from "../components/MediaRecorder";
import SpeechRecognition from "../components/SpeechRecognition";
import { useAudioDevices } from "../hooks/devices";

const AudioSpeech = () => {
  const devices = useAudioDevices({ autoInit: false });

  return <div>
    <h1>AudioSpeech Test</h1>

    <hr />
    <h2>Devices</h2>
    <DeviceSelection devices={devices} />

    <hr />
    <h2>AudioContext</h2>
    <AudioContext devices={devices} />

    <hr />
    <h2>SpeechRecognition</h2>
    <SpeechRecognition />

    <hr />
    <h2>MediaRecorder</h2>
    <MediaRecorder devices={devices} />
  </div>
};

export default AudioSpeech;