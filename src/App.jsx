import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PortfolioHub from './PortfolioHub';
import CaseStudy from './CaseStudy';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioHub />} />
      <Route path="/projects/:id" element={<CaseStudy />} />
    </Routes>
  );
}