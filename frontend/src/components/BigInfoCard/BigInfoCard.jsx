import React from 'react';
import './BigInfoCard.css';

const BigInfoCard = ({ pokemon }) => {
  return (
    <div className="big-info-card">
      <h2 className="big-card-name">{pokemon.name}</h2>
      <div className="big-card-body">
        {/* LEFT SIDE */}
        <div className="big-card-left">
          <img src={pokemon.sprite} alt={pokemon.name} className="big-card-image" />
          <div className="info-block">
            <p><strong>Height:</strong> {pokemon.height / 10} m</p>
            <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
            <p><strong>Type:</strong> {pokemon.types.join(', ')}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="big-card-right">
          {pokemon.stats.map((stat, index) => (
            <div key={index} className="stat-block">
              <span className="stat-name">{stat.statName.toUpperCase()}</span>
              <span className="stat-value">{stat.baseStat}</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: `${(stat.baseStat / 150) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BigInfoCard;
