import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot
import {
  BrowserRouter as Router,
  Routes, // Use Routes instead of Switch
  Route,
  Navigate, // Use Navigate instead of Redirect
} from 'react-router-dom';

import './styles/global.css'; // Corrected import path
import MainScreenON from './pages/main-screen-on';
import Login from './pages/login';
import Homepage from './pages/homepage';
import Profilesetting from './pages/profilesetting';
import MainScreenOFF from './pages/main-screen-off';
import NotFound from './pages/not-found';

const App = () => {
  return (
    <Router>
      <Routes>
        {' '}
        {/* Use Routes */}
        <Route
          path='/main-screen-on'
          element={<MainScreenON />}
        />{' '}
        {/* Use element prop */}
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/'
          element={<Homepage />}
        />
        <Route
          path='/profilesetting'
          element={<Profilesetting />}
        />
        <Route
          path='/main-screen-off'
          element={<MainScreenOFF />}
        />
        <Route
          path='*'
          element={<NotFound />}
        />{' '}
        {/* Not found route */}
        {/* <Navigate to="*" /> This is not needed with the above route*/}
      </Routes>
    </Router>
  );
};

// Use createRoot for React 18 and above
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
