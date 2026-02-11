```jsx
import React, { useState, useEffect } from 'react';

const RTX3060VRAMMonitor = () => {
    const [vramUsage, setVramUsage] = useState(0);

    useEffect(() => {
        // Function to fetch VRAM usage data (simulated here)
        const fetchVRAMUsage = async () => {
            try {
                const response = await fetch('/api/vram');
                const data = await response.json();
                setVramUsage(data.usage);
            } catch (error) {
                console.error('Error fetching VRAM usage:', error);
            }
        };

        // Fetch VRAM usage every 5 seconds
        const intervalId = setInterval(fetchVRAMUsage, 5000);

        // Cleanup function to clear the interval
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h1>RTX 3060 VRAM Monitor</h1>
            <p>Current VRAM Usage: {vramUsage}%</p>
        </div>
    );
};

export default RTX3060VRAMMonitor;
```
