/**
 *
 * @type {*}
 */

var fs = require('fs'),
    stream = require('stream'),
    readline = require('readline');


var pathToLogs = './logs/';
var pathToParsedLogs = './parsed/';

var expresionsToClear = [
    new RegExp('Sep (0-9){2}', 'g'),
    'cd-adb-prod apache2: /var/www/adb-tnr2850st-v2.stb.go.canaldigital.com',
    new RegExp(': ', 'g'),
    new RegExp('  ', 'g')
];

var pareseLogFile = function(filename){
    if (0 !== filename.indexOf('log')) {
        
        return;
    }
    
    var instream = fs.createReadStream(pathToLogs + filename);
    var outstream = fs.createWriteStream(pathToParsedLogs + filename);
    var rl = readline.createInterface(instream, outstream);
    
    console.log('START with ' + filename);
    
    rl.on('line', function(line) {
        expresionsToClear.map(function(expr) {
            line = line.replace(expr, '');
        })
        outstream.write(line + "\n");
    });
    
    rl.on('close', function() {
        console.log('DONE with ' + filename);
    });
    
}

fs.readdir(pathToLogs, function(err, files) {
    files.map(pareseLogFile);
});