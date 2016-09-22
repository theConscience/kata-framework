'use strict';

var path = require('path'),
  fs = require('fs');

var getFolders = function(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
};

module.exports = getFolders;
