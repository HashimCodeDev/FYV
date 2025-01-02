import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot
import {
  BrowserRouter as Router,
  Routes, // Use Routes instead of Switch
  Route,
  Navigate, // Use Navigate instead of Redirect
} from 'react-router-dom';

import './styles/global.css'; // Corrected import path
import Chatroom from './pages/chatroom';
import Login from './pages/login';
import Homepage from './pages/homepage';
import Profilesetting from './pages/profilesetting';
import Lobby from './pages/lobby'; // Updated import
import NotFound from './pages/not-found';
import ScanId from './pages/scanId';

const App = () => {
  return (
    <Router>
      <Routes>
        {' '}
        {/* Use Routes */}
        <Route
          path='/chatroom'
          element={<Chatroom />}
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
          path='/lobby'
          element={<Lobby />} // Updated route
        />
        <Route
          path='/scanId'
          element={<ScanId />} // Add new route for scanId
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
