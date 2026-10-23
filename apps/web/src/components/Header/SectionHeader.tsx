import './SectionHeader.css';

interface SectionHeaderProps {
  text: string;
}

const SectionHeader = ({ text }: SectionHeaderProps) => {
  return (
    <div className="section-header-container">
      <h2 className="section-header">{text}</h2>
    </div>
  );
};

export default SectionHeader;
