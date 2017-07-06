/**
 * Created by Migue on 05/07/2017.
 */
const xml2json = require('xml-to-json'),
    dowload = require('download'),
    fs = require('fs');
var url = 'https://tools.wmflabs.org/kmlexport?article=Municipalities_of_Cuba';

dowload(url, 'input')
    .then(function (e) {
      xml2json({
        input: 'input/doc.kml',
        output: 'output/response.json'
      }, function (e, result) {
        if (e) {
          throw e;
        } else {
          fs.readFile('output/response.json', 'utf8', dataLoaded);

          function dataLoaded(err, data) {
            var province = JSON.parse(data).kml.Document.Folder;
            var result = [];
            for (var i = 0; i < province.length; i++) {
              var municipality = [];
              for (var j = 0; j < province[i].Placemark.length; j++) {
                var coordinates = province[i].Placemark[j].Point.coordinates.split(',');
                municipality.push({
                  name: province[i].Placemark[j].name,
                  latitude: coordinates[0],
                  logitude: coordinates[1]
                })
              }
              result.push({
                name: province[i].name.replace('Province', ''),
                municipality: municipality
              })
            }
            fs.writeFile('output/response.json', JSON.stringify(result), function (e) {
              if (e) {
                throw e;
              } else {
                console.info('Success true')
              }
            })
          }
        }
      });
    });
