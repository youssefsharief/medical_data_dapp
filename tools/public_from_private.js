const e = require('ethereumjs-util')

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


rl.on('line', function(line){
    const a = e.privateToPublic(Buffer.from(line, 'hex'))
    console.log(a.toString('hex'))
})