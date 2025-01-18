import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate, // Use Navigate instead of Redirect
} from 'react-router-dom';

import './styles/global.css'; // Import global styles
import Chatroom from './pages/chatroom'; // Import Chatroom
import Login from './pages/login'; // Import Login
import Homepage from './pages/homepage'; // Import Homepage
import Profilesetting from './pages/profilesetting'; // Import Profilesetting
import Lobby from './pages/lobby'; // Import Lobby
import NotFound from './pages/not-found'; // Import NotFound
import ScanId from './pages/scanId'; // Import ScanId
import Register from './pages/register';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
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
          path='/register'
          element={<Register/>}
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
