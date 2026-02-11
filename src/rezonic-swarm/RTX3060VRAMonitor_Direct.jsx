```jsx
import React, { useState, useEffect } from 'react';
import './RTX3060VRAMonitor.css';

const RTX3060VRAMonitor = () => {
  const [vramUsed, setVramUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVRAMData = async () => {
      try {
        const response = await fetch('https://api.example.com/vram');
        const data = await response.json();
        setVramUsed(data.vramUsed);
      } catch (error) {
        console.error('Error fetching VRAM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVRAMData();
    setInterval(fetchVRAMData, 2000);
  }, []);

  const vramPercentage = ((vramUsed / 12) * 100).toFixed(2);

  let progressBarColor;
  if (vramPercentage < 70) {
    progressBarColor = 'green';
  } else if (vramPercentage < 85) {
    progressBarColor = 'yellow';
  } else {
    progressBarColor = 'red';
  }

  return (
    <div className="rtx3060-vram-monitor">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>RTX 3060 VRAM Monitor</h1>
          <p>Used VRAM: {vramUsed.toFixed(2)} GB</p>
          <p>Total VRAM: 12 GB</p>
          <p>Percentage Used: {vramPercentage}%</p>
          <div className="progress-bar" style={{ backgroundColor: progressBarColor }}>
            <div
              className="progress"
              style={{ width: `${vramPercentage}%` }}
            ></div>
          </div>
          <p>{new Date().toLocaleString()}</p>
        </>
      )}
    </div>
  );
};

export default RTX3060VRAMonitor;
```

```css
.rtx3060-vram-monitor {
  background-color: #121212;
  color: #87CEEB;
  padding: 20px;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.progress-bar {
  height: 20px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
}
```
