'use strict';

/** Менеджер подключений */
var fs = require('fs');

var getSubTemplateDepthLvl = function(folder, depthfilename, filesrc) {

  console.log('folder:', folder);
  var subDepthLvl = '';
  var files = fs.readdirSync(filesrc + '/' + folder);
  console.log('files:', files);

  files.forEach(function(file) {
    console.log('file:', file);
    if (file === depthfilename) {
      var data = fs.readFileSync(filesrc + '/' + folder + '/' + file, 'utf8');
      console.log('data:', data);
      subDepthLvl = parseInt(data, 10);
      console.log('subDepthLvl, type:', subDepthLvl, ',', typeof subDepthLvl);
    }
  });

  return subDepthLvl;
};


module.exports = getSubTemplateDepthLvl;
