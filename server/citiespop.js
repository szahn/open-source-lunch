var fs = require('fs'), util = require('util'), stream = require('stream'), es = require('event-stream');

const filename = process.argv && process.argv[2] ? process.argv[2] : "data/usacitiespop.txt";
console.log(`Reading ${filename}...`);

const records = [];

lineToRecord = (line) => {
    let record = line.split(',');
    let [country, city, accentCity, region, population,lat,lon] = record;
    let popInt;
    if (population && (popInt = parseInt(population, 10)) > 0){
        records.push([city, region, popInt, lat, lon]);
    }    
};

var s = fs.createReadStream(filename)
    .pipe(es.split())
    .pipe(es.mapSync(function(line){
        s.pause();

        if (line){
            lineToRecord(line);
        }

        s.resume();
    })
    .on('error', function(err){
        console.log('Error while reading file.', err);
    })
    .on('end', function(){
        const outFile = filename.substr(0, filename.lastIndexOf(".")) + ".json";
        console.log(`Saved to ${outFile}`);
        fs.writeFile(outFile, JSON.stringify(records), 'utf-8', function(err) {
            if (err) throw err
            console.log('Done!')
        })
    })
);
