
import React, { useEffect } from 'react';

const monday = window.mondaySdk();

export default function App() {
  useEffect(() => {
    monday.listen("context", res => {
      console.log("✅ App running inside Monday. Context:", res);
    });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ App Loaded inside Monday</h1>
      <p>If you're seeing this, the embed and SDK are working correctly.</p>
    </div>
  );
}
