import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Honeypot from './components/Honeypot';
import Admin from './components/Admin';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Honeypot />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    );
}

export default App;
