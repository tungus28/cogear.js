const chalk = require('chalk');
const boxen = require('boxen')
module.exports = `${boxen("\n"+chalk.bold.whiteBright('Cogear.JS – modern static websites generator.')+"\n\nhttps://cogearjs.org", {
	padding: {top: 1, bottom: 1,left: 8,right: 8},
	margin: 0,
	dimBorder: true,
	align: "center",
	borderStyle: "single-double",
	borderColor: "magenta"
})}

Usage: ${chalk.bold.whiteBright('cogear [command]')}

${chalk.bold.whiteBright('Runs in development mode by default (without [command]).')}

${chalk.bold('Options:')}

  -h, --help          output usage information
  -s, --src           set source directory, default: ./src
  -o, --output        set output directory, default: ./public
  -h, --host          set host for local server, default: localhost
  -p, --port          set port for local server, default: 9000
  -o, --open          if set to false, browser will not be opened after build, default: false
  -q, --quiet         set webpack verbose mode, default: true
  -v, --version       print current version

Commands:
	
  command   (alias)     [optional]      description
	
  ${chalk.bold.whiteBright('[dev]')}        (d)                     run dev server # hot-reload for pages, scripts, styles [DEFAULT]
  ${chalk.bold.whiteBright('production')}   (p)                     run build and starts static server # optional, default, no hot reload on changes
  ${chalk.bold.whiteBright('build')}        (b)                     run build
  ${chalk.bold.whiteBright('deploy')}       (d)       [preset]      deploy site to server
  ${chalk.bold.whiteBright('new')}          (n)       [site-name]   generate new site
  ${chalk.bold.whiteBright('plugin')}       (p)       [plugin-name] generate plugin boilerplate
  ${chalk.bold.whiteBright('theme')}        (t)       [theme-name]  generate theme boilerplate

For more information visit:
${chalk.bold.whiteBright('https://cogearjs.org')}`