import { describe, expect, it } from 'vitest';
import { cleanFlavorText } from '../src/seed/flavor-text.js';


describe('Flavor text conversion with cleanFlavorText', () => {

	it ('Basic conversion STONE --> stone', () => {
		const result = cleanFlavorText('STONE');
		expect(result).toBe('stone');
	});

});