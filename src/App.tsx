import React from 'react';
import FrontPage from './components/FrontPage';
import { ApiProvider } from './api/ApiProvider';

function App() {
  return (
    <div className="App" data-testid="apptestid">
    <ApiProvider>
    <FrontPage />
  </ApiProvider>
  </div>
  );
}

export default App;
