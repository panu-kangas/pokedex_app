import React from "react";
import './SectionHeader.css';

const SectionHeader = ({ text }) => {

	return (
		<div className="section-header-container">
			<h2 className="section-header">{text}</h2>
		</div>
	);
};



export default SectionHeader;