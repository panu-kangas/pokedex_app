import { Chart as ChartJS } from 'chart.js';

// Chart.js draws on a canvas, so it can't read the CSS variables; keep these in sync with tokens.css
ChartJS.defaults.color = '#a4a9cc';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
ChartJS.defaults.font.family = "'Inter', system-ui, sans-serif";

export const cardAnimation = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeOut' },
} as const;
