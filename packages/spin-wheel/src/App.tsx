import React from 'react';
import { SpinWheel } from './components/SpinWheel';
import './index.css';

const App: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SpinWheel numItems={4} />
    </div>
  );
};

export default App;
