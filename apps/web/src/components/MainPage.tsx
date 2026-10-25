import NavBar from './Layout/NavBar';
import Hero from './Layout/Hero';
import Section from './Layout/Section';
import Footer from './Layout/Footer';
import GameBoy from './GameBoy/GameBoy';
import TypesCountChart from './DataCharts/TypesCountChart';
import WeightDistChart from './DataCharts/WeightDistChart';
import SearchBar from './SearchBar/SearchBar';

const MainPage = () => (
  <>
    <NavBar />
    <main>
      <Hero />
      <Section
        id="viewer"
        eyebrow="Viewer"
        title="Flip through the Pokédex"
        description="Browse all 151 Pokémon with the arrows, and open More info for full stats."
      >
        <GameBoy />
      </Section>
      <Section
        id="stats"
        eyebrow="Data"
        title="Gen I by the numbers"
        description="Live aggregations from the API: how types and sizes are distributed."
      >
        <TypesCountChart />
        <WeightDistChart />
      </Section>
      <Section
        id="search"
        eyebrow="Search"
        title="Find any Pokémon"
        description="Search by name. Partial matches work too."
      >
        <SearchBar />
      </Section>
    </main>
    <Footer />
  </>
);

export default MainPage;
