import { useEffect, useState } from "react";

const getScreenResolution = () => ({
  availWidth: window.screen.availWidth,
  availHeight: window.screen.availHeight,
  width: window.screen.width,
  height: window.screen.height,
  realWidth: window.screen.width * window.devicePixelRatio,
  realHeight: window.screen.height * window.devicePixelRatio,
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight,
});

const ScreenResolution = () => {
  const [screenResolution, setScreenResolution] = useState(getScreenResolution());

  useEffect(() => {
    const resizeHandler = () => setScreenResolution(getScreenResolution());
    window.addEventListener('resize', resizeHandler);
    window.screen.orientation.addEventListener("change", resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.screen.orientation.removeEventListener("change", resizeHandler);
    };
  }, []);

  return (
    <div>
      <hr />
      <h1>Screen Resolution</h1>
      <p>{JSON.stringify(screenResolution, null, 4)}</p>
    </div>
  );
};

export default ScreenResolution;