import chalk from 'chalk';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import Pokemon from './models/Pokemon.js';
import { startMsg, endMsg } from './serverMessages.js';

dotenv.config();

// SERVER STUFF

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'https://pokedex-app-seven-tan.vercel.app')
	.split(',')
	.map(origin => origin.trim());
const MAX_SEARCH_LENGTH = 30;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Render runs behind a proxy; without this every request shares the proxy's IP in the rate limiter
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: CORS_ORIGINS }));
app.use('/api', rateLimit({
	windowMs: 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: { message: 'Too many requests, please try again later' },
}));

mongoose.connect(MONGO_URI)
	.then(() => console.log('\n\n🧠 Connected to MongoDB'))
	.catch(err => console.error('MongoDB connection failed:', err.message));


app.get('/api/pokemon/:id', async (req, res) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id < 1) {
		return res.status(400).json({ message: 'Invalid Pokémon id' });
	}

	const pokemon = await Pokemon.findOne({ id });
	if (!pokemon) {
		return res.status(404).json({ message: 'Pokémon not found' });
	}
	res.json(pokemon);
});

app.get('/api/pokemon-search', async (req, res) => {
	const { name } = req.query;
	if (typeof name !== 'string' || !name.trim() || name.length > MAX_SEARCH_LENGTH) {
		return res.status(400).json({ message: `Search must be 1-${MAX_SEARCH_LENGTH} characters` });
	}

	const pokemon = await Pokemon.find({ name: { $regex: escapeRegex(name.trim()), $options: 'i' } });
	res.json(pokemon);
});

app.get('/api/types-count', async (req, res) => {

	const typeCount = {};
	const data = await Pokemon.find({});

	data.forEach( item => {
		item.types.forEach( type => {
			if (typeCount[type])
				typeCount[type] += 1;
			else
				typeCount[type] = 1;
		})
	})
	res.json(typeCount);
});

app.get('/api/weight-dist', async (req, res) => {

	const weightDist = {
		small: 0,
		medium: 0,
		large: 0
	};
	const data = await Pokemon.find({});

	data.forEach( item => {
		if (item.weight / 10 <= 30)
			weightDist['small'] += 1;
		else if (item.weight / 10 > 70)
			weightDist['large'] += 1;
		else
		weightDist['medium'] += 1;
	})
	res.json(weightDist);
});

app.use((req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Express 5 forwards errors from async handlers here, so routes need no try/catch
app.use((err, req, res, _next) => {
	console.error(err);
	res.status(500).json({ message: 'Internal server error' });
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
