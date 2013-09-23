/**
 *
 * @type {*}
 */

var fs = require('fs'),
    stream = require('stream'),
    readline = require('readline');


var pathToLogs = './source/';
var pathToParsedLogs = './parsed/';

var expresionsToClear = [
    new RegExp('Sep [0-9]{2} ', 'g'),
    new RegExp('cd-adb-prod apache2: /var/www/adb-tnr2850st-v2.stb.go.canaldigital.com [a-z0-9]{8,10} '),
    new RegExp(': ', 'g'),
    new RegExp('  ', 'g')
];

var pareseLogFile = function(filename){
    if (0 !== filename.indexOf('log')) {

        console.log ('File ' + filename + ' skipped');
        return;
    }

    fs.exists(pathToParsedLogs + filename , function (exists){
        if (exists) {
            console.log ('File ' + filename + ' already parsed');
        } else {
            console.log('START with ' + filename);

            var instream = fs.createReadStream(pathToLogs + filename);
            var outstream = fs.createWriteStream(pathToParsedLogs + filename);
            var rl = readline.createInterface(instream, outstream);

            var startFlag = false;

            rl.on('line', function(line) {
                if (!startFlag && -1 !== line.indexOf('--== START! ==--')) {
                    startFlag = true;
                }
                if (!startFlag || -1 !== line.indexOf('language::und')) {
                    //Skip the lines before start or from player debug
                    return
                }
                expresionsToClear.map(function(expr) {
                    line = line.replace(expr, ' ');
                })
                outstream.write(line + "\n");
            });

            rl.on('close', function() {
                console.log('DONE with ' + filename);
                startFlag = false;
            });
        }
    });
}

fs.readdir(pathToLogs, function(err, files) {

    if (err) throw err;
    if (files) {
        files.map(pareseLogFile);
    } else {
        console.log('No log files found');
    }
});
