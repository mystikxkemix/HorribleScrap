#!/usr/bin/env node

import program           from 'commander';
import {HorribleScrap} from './index';

type Command = {
	name        : string,
	command     : string,
	description : string,
	action      : (...arg:any) => Promise<any>,
	options     : Option[]
};

type Option = {command : string, description : string};

const commands:Command[] = [
	{
		name        : 'get',
		command     : 'get [show] [output]',
		description : 'Check if the specified MPM IDs are up to date.',
		action      : HorribleScrap.getEpisodes,
		options     : [
		]
	}
]

function setupCommand(command:Command){
	let commandProgram = program
		.command(command.command)
		.description(command.description);

	for(let option of command.options) commandProgram = commandProgram.option(option.command, option.description);

	commandProgram.action(async function(...args){
		try{
			await command.action(...args);
		}
		catch(e){
			console.log(e);
		}
	});
}

for(let command of commands)
    setupCommand(command);

program.on('command:*', function () {
	console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
	process.exit(1);
});

program.parse(process.argv);
