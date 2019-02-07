const inFolder = '_content/';
const outFolder = 'dist/';

const fs = require('fs-extra');
const YAML = require('yamljs');

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) return done(null, results);
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });
      })();
    });
  };

(async () => {

    walk(inFolder, function(err, results) {
        if (err) throw err;

        results.forEach(filePath => {
            const yamlString = fs.readFileSync(filePath).toString();
            const outFilePath = filePath.replace(inFolder, outFolder).replace('.md','.json');
            debugger;
            var obj = YAML.parse(yamlString);
            var json = JSON.stringify(obj, null, 2);
            fs.outputFile(outFilePath, json, 'utf8');
        })

        fs.copy('./static', './dist/static/', err => {
            if(err) return console.error(err);
            console.log('success!');
        });

    });

})()