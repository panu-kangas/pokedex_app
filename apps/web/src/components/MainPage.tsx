import { useRef, type RefObject } from 'react';
import Header from './Header/Header';
import GameBoy from './GameBoy/GameBoy';
import SectionHeader from './Header/SectionHeader';
import TypesCountChart from './DataCharts/TypesCountChart';
import WeightDistChart from './DataCharts/WeightDistChart';
import SearchBar from './SearchBar/SearchBar';
import './MainPage.css';

const scrollTo = (ref: RefObject<HTMLDivElement | null>) =>
  ref.current?.scrollIntoView({ behavior: 'smooth' });

const MainPage = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <div className="main-container">
      <Header />

      <div className="firstInfoBox">
        <span className="welcomeText">Welcome!</span>
        <span className="infoText">
          This is a little page dedicated to Gen I Pokémon. <br />
          Take your time, have fun, and enjoy your stay! 😊 <br />
        </span>
      </div>

      <div className="section-button-row">
        <button onClick={() => scrollTo(viewerRef)}>Pokémon Viewer</button>
        <button onClick={() => scrollTo(factsRef)}>Pokémon Facts</button>
        <button onClick={() => scrollTo(searchRef)}>Search for Pokémon</button>
      </div>

      <hr className="type-divider" />
      <div ref={viewerRef}>
        <SectionHeader text="Pokémon Viewer" />
      </div>
      <GameBoy />
      <hr className="type-divider" />
      <div ref={factsRef}>
        <SectionHeader text="Pokémon Facts" />
      </div>
      <TypesCountChart />
      <WeightDistChart />
      <hr className="type-divider" />
      <div ref={searchRef}>
        <SectionHeader text="Search for Pokémon" />
      </div>
      <SearchBar />
    </div>
  );
};

export default MainPage;
