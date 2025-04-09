import chalk from 'chalk';
import express from 'express';
import mongoose from 'mongoose';

import { startMsg, endMsg } from './serverMessages.js';

// SERVER STUFF

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Pokédex API!' });
});

const server = app.listen(port, () => {
    startMsg(port);
});


// SIGINT handler
process.on('SIGINT', () => {
	endMsg();
	
    server.close(() => {
        console.log(chalk.blue('\nClosed all connections. Exiting now.\n'));
        process.exit(0);
    });

    setTimeout(() => {
        console.error(chalk.red('Could not close connections in time, forcefully shutting down'));
        process.exit(1);
    }, 10000);

});

// DATABASE STUFF

mongoose.connect('mongodb://localhost:27017/pokedex', {}).then(() => {
    console.log(chalk.blue('\n\nConnected to MongoDB!'));
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});


// Add test Pokemon

const pokemonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
		unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
    abilities: {
        type: [String],
        required: true,
    }
});


const Pokemon = mongoose.model('Pokemon', pokemonSchema);

const testPokemon = new Pokemon({
    name: 'Pikachu',
    type: 'Electric',
    level: 25,
    abilities: ['Thunderbolt', 'Quick Attack']
});

Pokemon.findOne({ name: testPokemon.name })
    .then((existingPokemon) => {
        if (existingPokemon) {
            console.log('Pikachu already exists in the database!');
        } else {
            testPokemon.save()
                .then(() => {
                    console.log('Test Pokémon added!');
                })
                .catch((err) => {
                    console.error('Error adding test Pokémon:', err);
                });
        }
    })
    .catch((err) => {
        console.error('Error checking for existing Pokémon:', err);
    });