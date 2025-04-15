import { React } from 'react';
import typeColors from '../../types/typeConfig';

const InfoCard = ({ id, name, image, type, idChange }) => {
	
	let backgroundStyle;
	let secondBg;

	if (Array.isArray(type) && type.length === 2) {
	const [type1, type2] = type;
	backgroundStyle = {
		backgroundColor: typeColors[type1] || '#777',
		transition: 'background 0.8s ease', // Smooth transition for the background
	  };
	  secondBg = {
		backgroundColor: typeColors[type2] || '#777',
		width: '50%', // The second background takes up the other 50% of the width
		height: '100%', // Full height
		position: 'absolute', // Position it absolutely
		top: '0',
		left: '50%', // Position it on the right half
		transition: 'background 0.8s ease', // Smooth transition for the background
	  };
	} else {
	backgroundStyle = {
		backgroundColor: typeColors[type[0]] || '#777',
		transition: 'background 0.8s ease', // Smooth transition for background
	};
	}

	return (
	<div className="info-card" style={ backgroundStyle }>
	
		<div className="pokemon-id">{id}</div>
		<img
			src={image}
			alt={name}
			className= {`pokemon-image ${idChange ? 'fade' : ''}`}
      	/>
		<div className="pokemon-name">{name}</div>

		<div style= { secondBg }></div>


	</div>
	);
};

export default InfoCard;