import React from 'react';
import typeColors from '../../types/typeConfig';

const InfoCard = ({ id, name, image, type }) => {

	let backgroundStyle;

	if (Array.isArray(type) && type.length === 2) {
	const [type1, type2] = type;
	backgroundStyle = {
		background: `linear-gradient(135deg, ${typeColors[type1]} 50%, ${typeColors[type2]} 50%)`
	};
	} else {
	backgroundStyle = {
		backgroundColor: typeColors[type[0]] || '#777'
	};
	}

	return (
	<div className="info-card" style={ backgroundStyle }>
		<div className="pokemon-id">{id}</div>
		<img src={image} alt={name} className="pokemon-image" />
		<div className="pokemon-name">{name}</div>
	</div>
	);
};

export default InfoCard;