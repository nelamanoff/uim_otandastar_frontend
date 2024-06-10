import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import MapView from './components/MapView';
import UimDetail from './components/UimDetail';
import { Container } from '@mui/material';

const App = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/country');
        const data = await response.json();
        console.log('Fetched countries:', data);
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <Router>
      <Container>
        <h1>Ұйымдар</h1>
        <Routes>
          <Route path="/" element={<MapView countries={countries} />} />
          <Route path="/uim/:id" element={<UimDetail />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
