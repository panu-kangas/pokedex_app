import chalk from 'chalk';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import Pokemon from './models/Pokemon.js';
import { startMsg, endMsg } from './serverMessages.js';
 
dotenv.config();

// SERVER STUFF

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


app.use(cors({
	origin: 'https://pokedex-app-seven-tan.vercel.app',
}));


mongoose.connect(MONGO_URI)
	.then(() => console.log('\n\n🧠 Connected to MongoDB'))
	.catch(err => console.log(err));


console.log('Connecting to MongoDB at:', MONGO_URI);


app.get('/api/pokemon/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const pokemon = await Pokemon.findOne({ id });
		if (!pokemon) {
		return res.status(404).json({ message: 'Pokémon not found' });
		}
		res.json(pokemon);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching Pokémon', error: err });
	}
	});

app.get('/api/pokemon-search', async (req, res) => {
	try {
		const searchQuery = req.query.name;
		const pokemon = await Pokemon.find({ name: { $regex: searchQuery, $options: 'i'} });
		if (!pokemon) {
		return res.status(404).json({ message: 'Pokémon not found' });
		}
		res.json(pokemon);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching Pokémon', error: err });
	}
	});

app.get('/api/types-count', async (req, res) => {
	
	const typeCount = {};

	try {
		const data = await Pokemon.find({});
		if (!data)
			return res.status(404).json({ message: 'Pokémon data not accessible' });

		data.forEach( item => {
			item.types.forEach( type => {
				if (typeCount[type])
					typeCount[type] += 1;
				else
					typeCount[type] = 1;
			})
		})
		res.json(typeCount);

	} catch (err) {
		res.status(500).json({ message: 'Error fetching Pokémon', error: err });
	}
});

app.get('/api/weight-dist', async (req, res) => {
	
	const weightDist = {
		small: 0,
		medium: 0,
		large: 0
	};

	try {
		const data = await Pokemon.find({});
		if (!data)
			return res.status(404).json({ message: 'Pokémon data not accessible' });

		data.forEach( item => {
			if (item.weight / 10 <= 30)
				weightDist['small'] += 1;
			else if (item.weight / 10 > 70)
				weightDist['large'] += 1;
			else
			weightDist['medium'] += 1;
		})
		res.json(weightDist);

	} catch (err) {
		res.status(500).json({ message: 'Error fetching Pokémon', error: err });
	}
});


const server = app.listen(PORT, () => {
    startMsg(PORT);
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

