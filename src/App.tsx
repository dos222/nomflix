import React from 'react';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tv';

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/tv" element={<Tv />} />
        <Route path="search" element={<Search /> }/>
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>  
  );
}

export default App;
