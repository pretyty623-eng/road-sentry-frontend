
export const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClass = `loader-${size}`;
  
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className={`loader ${sizeClass}`}></div>
      </div>
    );
  }
  
  return <div className={`loader ${sizeClass}`}></div>;
};