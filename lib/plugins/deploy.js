const boxen = require('boxen');
// const inquirer = require('inquirer');
const chalk = require('chalk');
// const now = require('performance-now');
// const prettyMs = require("pretty-ms");
const ora = require("ora");
// const shell = require('shelljs')
const merge = require('webpack-merge')
// const validUrl = require('valid-url')
const fs = require('fs')
const now = require('performance-now')
const prettyMs = require('pretty-ms')
const path = require('path')
const os = require('os')
const shell = require('shelljs')
const FTPS = require('ftps')
const util = require('util')
module.exports = {
	apply(cogear){
		cogear.hooks.banner.tap("Show deploy banner",()=>{
			// Only to show box at the top
			if(["d","deploy"].includes(cogear.options._[0])){
				console.log(boxen(`Deploying with ${chalk.bold("Cogear.JS")}\n\nv${cogear.package.version}`,{
					padding: {top: 1, bottom: 1,left: 8,right: 8},
					margin: 0,
					dimBorder: true,
					align: "center",
					borderStyle: "double",
					borderColor: "magenta",
				}))
			}
		})
		cogear.hooks.deploy.tap('Deploy',()=>{
			this.deploy(cogear)
		})
	},
	deploy(cogear){

		/**
		 * TODO
		 * 
		 * # Read config
		 * # Quiz
		 * # Upload
		 */
		let loader = ora("Searching for presets…").start()
		let config;
		try {
			config = cogear.config.deploy || require(path.join(process.cwd(),'deploy'))
		}	catch (e) {
			loader.fail(`No deploy config found.\nLearn more:\n${chalk.bold.whiteBright('https://cogearjs.org/docs/deploy')}`)
			process.exit()			
		}
		finally {
			let presets = Object.keys(config);
			loader.succeed(`Presets found: ${presets.map(preset => chalk.bold(preset)).join(', ')}`)
			let preset = presets.shift()
			if(!cogear.options._[1]){
				loader.info(`No preset is chosen.`)
				loader.info(`Starting ${chalk.bold(preset)} preset by default…\n`)
			}
			else if(presets.includes(cogear.options._[1])){
				preset = cogear.options._[1];
				loader.info(`Preset ${chalk.bold(preset)} is chosen.`)
				// loader.start(`Starting deploying…\n`)
			}
			let defaults = {
				type: "ftp",
				port: 21,
				user: "deploy",
				password: null,
				commands: "-avz --delete --progress --quiet", // for rsync
			}
			options = merge(defaults,config[preset])
			// pkPath = options.privateKey.replace('~',os.homedir())
			// if(!fs.existsSync(pkPath)){
			// 	options.privateKey = null
			// }
			let start = now()
			let done = () =>{
				loader.succeed(`Deployed in ${prettyMs(now() - start)}.`)
			}
			switch(options.type){
				case 'ftp':
				const _cliProgress = require('cli-progress');
				const bar = new _cliProgress.Bar({
					format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | Uploading: {file}',
					stopOnComplete: true
				}, _cliProgress.Presets.shades_classic);
				loader.info('Start uploading files via FTP…')
				let barStarted = false
					const FtpDeploy = require('ftp-deploy');
					const ftpDeploy = new FtpDeploy()
					ftpDeploy.on('uploading', function(data) {
						if(!barStarted){
							bar.start(data.totalFilesCount,data.transferredFileCount,{
								file: data.filename
							})
							barStarted = true
						}
					});
					ftpDeploy.on('uploaded', function(data) {
						bar.update(data.transferredFileCount,{
							file: data.filename
						})
					})
					ftpDeploy.deploy({
						user: options.user,
						password: options.password,
						host: options.host,
						port: options.port,
						localRoot: cogear.options.output,
						remoteRoot: options.path,
						deleteRemote: true,
						include: ['*','**/*'],
						exclude: []
					})
					.then(res=>{
						done()
					})
					.catch(err => {
						loader.fail("Deploy failed.")
						console.log(err)
					})
				break;
				case 'sftp':
					const sftp = require('node-sftp-deploy');
					sftp({
						"host": options.host,
						"port": 22,
						"user": options.user,
						"pass": options.password,
						"remotePath": options.path,
						"sourcePath": cogear.options.output
				}, done);
				break;
				case 'rsync':
					if(!shell.which('rsync')){
						loader.fail(`${chalk.bold('rsync')} is not installed.`);
					}
					shell.exec(`rsync ${options.commands} ${cogear.options.output}/ ${options.user}@${options.host}:/${options.path}`,(code,out,err)=>{
						if(!err){
							done()
						} else {
							loader.fail('Deploy failed.')
						}
					})
				break;
			}
		}
	}
}