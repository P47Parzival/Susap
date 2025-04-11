import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import MockTestPage from './Pages/MockTestPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mock-test" element={<MockTestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
