import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ApiKeyModal from './components/ApiKeyModal';
import FloatingChatbot from './components/FloatingChatbot';
import MobileBottomNav from './components/MobileBottomNav';

import Home from './pages/Home';
import AiAssistant from './pages/AiAssistant';
import CropDiseases from './pages/CropDiseases';
import CropGuide from './pages/CropGuide';
import CropDetail from './pages/CropDetail';
import PestControl from './pages/PestControl';
import SoilFertilizer from './pages/SoilFertilizer';
import Weather from './pages/Weather';
import MarketPrices from './pages/MarketPrices';
import GovernmentSchemes from './pages/GovernmentSchemes';
import MyFarm from './pages/MyFarm';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminConsole from './pages/AdminConsole';
import NotFound from './pages/NotFound';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app-wrapper">
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/crop-diseases" element={<CropDiseases />} />
          <Route path="/crop-guide" element={<CropGuide />} />
          <Route path="/crop-guide/:id" element={<CropDetail />} />
          <Route path="/pest-control" element={<PestControl />} />
          <Route path="/soil-fertilizer" element={<SoilFertilizer />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/government-schemes" element={<GovernmentSchemes />} />
          <Route path="/my-farm" element={<MyFarm />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingChatbot />
      <MobileBottomNav />
      <ApiKeyModal />
    </div>
  );
}
