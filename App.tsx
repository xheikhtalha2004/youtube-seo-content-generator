import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Generator from './pages/Generator';
import History from './pages/History';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app" element={<Generator />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
// Force refresh
