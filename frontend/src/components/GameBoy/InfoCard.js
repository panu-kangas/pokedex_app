import React from 'react';

const InfoCard = ({ id, name, image }) => {
  return (
    <div className="info-card">
      <div className="pokemon-id">{id}</div>
      <img src={image} alt={name} className="pokemon-image" />
      <div className="pokemon-name">{name}</div>
    </div>
  );
};

export default InfoCard;