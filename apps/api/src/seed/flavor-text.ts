// Panu implements this one by hand (see the PR 7 plan): whitespace cleanup + modern casing
export function cleanFlavorText(text: string): string {
  
	return text.toLocaleLowerCase('en');

}
