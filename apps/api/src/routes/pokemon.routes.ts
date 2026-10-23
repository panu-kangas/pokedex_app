import { Router } from 'express';
import { getPokemonById, searchPokemon } from '../controllers/pokemon.controller.js';

export const pokemonRouter = Router();

pokemonRouter.get('/pokemon/:id', getPokemonById);
pokemonRouter.get('/pokemon-search', searchPokemon);
