#! /usr/bin/env node
var fs = require('fs'),
	meow = require('meow')

const cli = meow({
	help: `
Usage
	> leafify <file> into <collection-name> [-o <output-dir> ] [-a <author> ]
		Turn a .json file into a useable .leaf collection

Options
	-o, The directory to output generated leaves (default is leaves/ )
	-a, The author name (will be written within the leaf), useable by leafdb

Examples
	> flavour something.json into somethingElse
		somethingElse.leaf has been successfully created 
`,
	alias: {}
})

factory(cli.flags, ...cli.input)

function factory(flags, ...input) {
	let r = new RegExp(/(.*)\.json$/)
	if(r.test(input[0]) && input[1]==="into") {
		leafify(flags, ...input)
	} else {
		cli.showHelp()
	}
}

function leafify(flags, ...input) {
	let out = flags.o || 'leaves'
	fs.mkdir(out, err=>{})
	fs.readFile(input[0], (err,data)=>{
		if(err) console.log('[LEAFIFY][ERR]', err)
		fs.writeFile(out+'\\'+input[2]+'.leaf', `
##LEAF_SOH
{
	"collection": "${input[2]}",
	"author": "${flags.a || ''}",
	"creation": "${genDate()}"
}
##LEAF_EOH
${data}
`, err=>{ if(err) console.log('[LEAFIFY][ERR]', err) })
	})
	console.log('[LEAFIFY] Collection successfully generated')
}

function genDate() {
	let d = new Date()
	return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'-'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
}