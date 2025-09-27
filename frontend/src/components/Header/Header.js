import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
		<div className="subtitle-div">
			<p className="subtitle">Created by <span className="author-name">Panu Kangas</span></p>
		</div>
		<h1 className="main-title">POKÉDEX APP</h1>
    </header>
  );
};

export default Header;
