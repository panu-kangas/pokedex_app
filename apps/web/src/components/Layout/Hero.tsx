import { GITHUB_REPO_URL } from '../../constants/links';
import styles from './Hero.module.css';

const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
const STACK = ['React 19', 'TypeScript', 'Express', 'MongoDB', 'REST API'];

const Hero = () => (
  <section className={styles.hero} id="top">
    <div className={styles.copy}>
      <h1 className={styles.title}>
        A pocket guide to the <span className={styles.highlight}>original 151</span>
      </h1>
      <p className={styles.lead}>
        Flip through every Gen I Pokémon on a retro GameBoy, discover which types and sizes are the
        most common, and use search to find your favourite.
      </p>
      <div className={styles.actions}>
        <a href="#viewer" className={styles.primary}>
          Start exploring
        </a>
        <a href={GITHUB_REPO_URL} className={styles.secondary} target="_blank" rel="noreferrer">
          View source on GitHub
        </a>
      </div>
      <ul className={styles.stack} aria-label="Tech stack">
        {STACK.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </div>
    <div className={styles.art} aria-hidden="true">
      <img src={ARTWORK_URL} alt="" width={475} height={475} />
    </div>
  </section>
);

export default Hero;
