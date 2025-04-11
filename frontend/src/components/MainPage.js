import React from 'react';
import Header from './Header/Header';
import GameBoy from './GameBoy/GameBoy';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-container">
      <Header />
      <GameBoy />
    </div>
  );
};

export default MainPage;