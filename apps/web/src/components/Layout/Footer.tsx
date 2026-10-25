import { GITHUB_PROFILE_URL, GITHUB_REPO_URL } from '../../constants/links';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <p>
        Built by{' '}
        <a href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer">
          Panu Kangas
        </a>
      </p>
      <ul className={styles.links}>
        <li>
          <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
            Source code
          </a>
        </li>
        <li>
          <a href="https://pokeapi.co" target="_blank" rel="noreferrer">
            Data from PokéAPI
          </a>
        </li>
      </ul>
    </div>
  </footer>
);

export default Footer;
