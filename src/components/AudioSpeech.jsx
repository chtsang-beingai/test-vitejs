import { useAudioDevices } from "../hooks/devices";
import AudioContext from "./AudioContext";
import DeviceSelection from "./DeviceSelection";
import MediaRecorder from "./MediaRecorder";
import SpeechRecognition from "./SpeechRecognition";

const AudioSpeech = () => {
  const devices = useAudioDevices();

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