import React from 'react';
import Header from './Header/Header';
import GameBoy from './GameBoy/GameBoy';
import SectionHeader from './Header/SectionHeader';
import TypesCountChart from './DataCharts/TypesCountChart';
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
    </div>
  );
};


export default MainPage;