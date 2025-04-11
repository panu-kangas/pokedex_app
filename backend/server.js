import chalk from 'chalk';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Pokemon from './models/Pokemon.js';

import { startMsg, endMsg } from './serverMessages.js';

// SERVER STUFF

const app = express();
const port = 5000;

app.use(cors({
	origin: 'http://localhost:3000',
  }));

mongoose.connect('mongodb://localhost:27017/pokedex')
	.then(() => console.log('\n\n🧠 Connected to MongoDB'))
	.catch(err => console.log(err));



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

