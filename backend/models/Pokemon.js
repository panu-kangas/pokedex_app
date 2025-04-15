import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: Number,
  name: String,
  types: [String],
  sprite: String,
  weight: Number, // in hectograms
  height: Number, // in decimetres
  stats: [
    {
      statName: String,    // e.g. 'hp', 'attack', etc.
      baseStat: Number,    // e.g. 45
    }
  ]
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon; 
