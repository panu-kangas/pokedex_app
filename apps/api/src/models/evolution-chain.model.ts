import { Schema, model } from 'mongoose';
import type { EvolutionChain, EvolutionNode, EvolutionTrigger } from '@pokedex/shared';

const triggerSchema = new Schema<EvolutionTrigger>(
  {
    method: { type: String, enum: ['level-up', 'use-item', 'trade', 'other'], required: true },
    minLevel: Number,
    item: String,
  },
  { _id: false },
);

const nodeSchema = new Schema<EvolutionNode>(
  {
    pokemonId: { type: Number, required: true },
    name: { type: String, required: true },
    trigger: triggerSchema,
  },
  { _id: false },
);
nodeSchema.add({ evolvesTo: [nodeSchema] });

const evolutionChainSchema = new Schema<EvolutionChain>({
  chainId: { type: Number, required: true, unique: true },
  root: { type: nodeSchema, required: true },
});

export const EvolutionChainModel = model<EvolutionChain>('EvolutionChain', evolutionChainSchema);
