import type { RequestHandler } from 'express';
import { z } from 'zod';
import { HttpError } from '../errors.js';
import { findPokemonById, searchPokemonByName } from '../services/pokemon.service.js';

const MAX_SEARCH_LENGTH = 30;
const INVALID_ID = 'Invalid Pokémon id';
const INVALID_SEARCH = `Search must be 1-${MAX_SEARCH_LENGTH} characters`;

const idParamsSchema = z.object({
  id: z.coerce
    .number({ error: INVALID_ID })
    .int({ error: INVALID_ID })
    .positive({ error: INVALID_ID }),
});

const searchQuerySchema = z.object({
  name: z
    .string({ error: INVALID_SEARCH })
    .trim()
    .min(1, { error: INVALID_SEARCH })
    .max(MAX_SEARCH_LENGTH, { error: INVALID_SEARCH }),
});

export const getPokemonById: RequestHandler = async (req, res) => {
  const { id } = idParamsSchema.parse(req.params);
  const pokemon = await findPokemonById(id);
  if (!pokemon) throw new HttpError(404, 'Pokémon not found');
  res.json(pokemon);
};

export const searchPokemon: RequestHandler = async (req, res) => {
  const { name } = searchQuerySchema.parse(req.query);
  res.json(await searchPokemonByName(name));
};
