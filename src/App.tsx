import React from 'react';
import FrontPage from './components/FrontPage';
import { ApiProvider } from './api/ApiProvider';

function App() {
  return (
    <ApiProvider>
      <FrontPage />
    </ApiProvider>
  );
}

export default App;
