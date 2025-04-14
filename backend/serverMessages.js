import chalk from 'chalk';


export function startMsg(port)
{
	process.stdout.write(chalk.green('\n\
**********************************************\n\
**********************************************\n\
******                                  ******\n\
******      POKEDEX SERVER STARTED      ******\n\
******                                  ******\n\
******         '));
	
	process.stdout.write('Server running at:');
	
	process.stdout.write(chalk.green('       ******\n\
******       '));
		
	process.stdout.write(`${port}`);

	process.stdout.write(chalk.green('      ******\n\
******                                  ******\n\
**********************************************\n\
**********************************************'));
	
}

export function endMsg()
{
	process.stdout.write(chalk.red('\n\
**********************************************\n\
**********************************************\n\
******                                  ******\n\
******           SHUTTING DOWN          ******\n\
******           POKEDEX SERVER         ******\n\
******                                  ******\n\
**********************************************\n\
**********************************************'));
	
}