import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthProvider } from './context/AuthContext';
export const App:React.FC=()=> <BrowserRouter><AuthProvider><AppRoutes/></AuthProvider></BrowserRouter>;
export default App;
