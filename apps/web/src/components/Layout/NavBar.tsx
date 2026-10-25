import pokeball from '../../assets/pokeball.png';
import styles from './NavBar.module.css';

export const NAV_LINKS = [
  { href: '#viewer', label: 'Viewer' },
  { href: '#stats', label: 'Stats' },
  { href: '#search', label: 'Search' },
];

const NavBar = () => (
  <header className={styles.bar}>
    <nav className={styles.inner} aria-label="Main">
      <a href="#top" className={styles.brand}>
        <img src={pokeball} alt="" width={28} height={28} />
        <span>Pokédex</span>
      </a>
      <ul className={styles.links}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default NavBar;
