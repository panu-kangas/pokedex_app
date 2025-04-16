import React from 'react';
import Header from './Header/Header';
import GameBoy from './GameBoy/GameBoy';
import TypesCountChart from './DataCharts/TypesCountChart';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-container">
      <Header />
	  <TypesCountChart />
    </div>
  );
};

//       <GameBoy />


export default MainPage;