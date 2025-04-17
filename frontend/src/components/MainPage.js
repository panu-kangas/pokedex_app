import React from 'react';
import Header from './Header/Header';
import GameBoy from './GameBoy/GameBoy';
import SectionHeader from './Header/SectionHeader';
import TypesCountChart from './DataCharts/TypesCountChart';
import WeightDistChart from './DataCharts/WeightDistChart';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-container">
      <Header />
	  <hr className="type-divider" />
	  <SectionHeader text='Pokémon Viewer'/>
	  <GameBoy />
	  <hr className="type-divider" />
	  <SectionHeader text='Pokémon Facts'/>
	  <TypesCountChart />
	  <WeightDistChart />
    </div>
  );
};


export default MainPage;