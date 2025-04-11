import mongoose from 'mongoose';
import axios from 'axios';
import Pokemon from './models/Pokemon.js';

const MONGO_URI = 'mongodb://localhost:27017/pokedex';

const seedPokemons = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('🧠 Connected to MongoDB');

    const pokemons = [];

    for (let id = 1; id <= 151; id++) {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      
      pokemons.push({
        id: data.id,
        name: data.name,
        types: data.types.map(t => t.type.name),
        sprite: data.sprites.front_default,
      });

      console.log(`✅ Loaded ${data.name}`);
    }

    // Clear and insert new data
    await Pokemon.deleteMany({});
    await Pokemon.insertMany(pokemons);

    console.log('🚀 Successfully seeded Pokédex with 151 Pokémon');
    process.exit();

  } catch (err) {
    console.error('❌ Error seeding Pokémon:', err);
    process.exit(1);
  }
};

seedPokemons();