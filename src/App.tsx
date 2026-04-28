import React from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <AppProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </AppProvider>
  );
}

export default App;
