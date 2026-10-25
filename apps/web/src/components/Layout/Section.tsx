import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

const Section = ({ id, eyebrow, title, description, children }: SectionProps) => (
  <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
    <header className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={`${id}-title`} className={styles.title}>
        {title}
      </h2>
      <p className={styles.description}>{description}</p>
    </header>
    {children}
  </section>
);

export default Section;
