import { React, useState } from 'react';
import typeColors from '../../types/typeConfig';

const InfoCard = ({ id, name, image, type, idChange }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	
	let backgroundStyle;
	let secondBg;

	if (Array.isArray(type) && type.length === 2) {
	const [type1, type2] = type;
	backgroundStyle = {
		backgroundColor: typeColors[type1] || '#777',
		transition: 'background 0.8s ease', 
	  };
	  secondBg = {
		backgroundColor: typeColors[type2] || '#777',
		width: '50%',
		height: '100%',
		position: 'absolute',
		top: '0',
		left: '50%',
		transition: 'background 0.8s ease',
	  };
	} else {
	backgroundStyle = {
		backgroundColor: typeColors[type[0]] || '#777',
		transition: 'background 0.8s ease',
	};
	}

	return (
	<div className="info-card" style={ backgroundStyle }>
	
		<div className="pokemon-id">{id}</div>
		<img
			src={image}
			alt={name}
			className={`pokemon-image ${idChange && isLoaded ? 'fade' : ''}`}
			onLoad={ () => setIsLoaded(true) }
      	/>
		<div className="pokemon-name">{name}</div>

		<div style= { secondBg }></div>


	</div>
	);
};

export default InfoCard;