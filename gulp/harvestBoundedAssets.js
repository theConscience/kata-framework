'use strict';

var path = require('path'),
  fs = require('fs'),
  glob = require('glob'),
  fs_ex = require('fs-extra'),
  gutil = require('gulp-util'),
  through = require('through2');


  var checkExtension = function(filePath, defaultExt) {
    var hasExtension = path.extname(filePath);
    console.log('has_extension ===', hasExtension, !!hasExtension);
    var newFilePath = '';

    if (!hasExtension) {
      console.log('File has no extension, add default:', defaultExt);
      newFilePath = filePath + defaultExt;
      console.log('File path with added extension:', newFilePath);
    } else {
      console.log('File already has extension:', hasExtension);
    }

    if (newFilePath) {
      return newFilePath;
    }
    return filePath;
  };


  //  './source/pages/!(layouts)/**/!(_*).jade'
  var isTemplateInherited = function(file_path) {
    console.log('Called isTemplateInherited(' + file_path + ')');

    var default_ext = '.jade';
    var fixed_file_path = checkExtension(file_path, default_ext);
    console.log('!!!!!!!! fixed_file_path === ' + fixed_file_path);

    var f = fs.readFileSync(fixed_file_path, 'utf8');
    var file_strings_data = f.split('\n');
    var extends_in_file = [];
    file_strings_data.forEach(function(item, i) {  // проверяем построчно наличие директивы extends
      if (item.indexOf('extends ') !== -1) {
        console.log(' Found extends statement in string #', i);
        extends_in_file = [];
        extends_in_file.push([item, i]);
      }
    });

    if (extends_in_file.length) {
      console.log('  >> template IS inherited!!!');
      return {
        check: true,
        data: extends_in_file
      };
    } else {
      console.log('  >> template is NOT inherited...');
      return {
        check: false,
        data: []
      };
    }
  };


  var getFolderOfParentTemplate = function getFolderOfParentTemplate(folders_array, file_path) {
    console.log('Called getFolderOfParentTemplate(' + file_path + ')');

    var extends_in_file = isTemplateInherited(file_path);

    if (!extends_in_file.check) {
      console.log('EXIT: no extends statement! Exit recursion.', file_path);
      return;
    } else if (extends_in_file.data[0][0].split(' ').length !== 2) {
      console.log(' ERROR: wrong extends statement in file:', file_path);
      return;
    }
    var extended_file_path = extends_in_file.data[0][0].split(' ')[1];
    console.log(' SUCCESS: extended file path found:', extended_file_path);

    var extended_file_rel_folder = path.dirname(extended_file_path);
    var extended_file_name = path.basename(extended_file_path);

    var file_folder = path.dirname(file_path);
    var extended_file_folder = path.join(file_folder, extended_file_rel_folder);
    // var extended_file_folder_n = './' + extended_file_folder.replace(/\\/gi, '/');
    var extended_file_folder_n = extended_file_folder.replace(/\\/gi, '/');
    var extended_file_abs_path = extended_file_folder_n + '/' + extended_file_name;

    console.log('    extended_file_rel_folder:', extended_file_rel_folder);
    console.log('    extended_file_name:', extended_file_name);
    console.log('    file_folder:', file_folder);
    console.log('    extended_file_folder:', extended_file_folder);
    console.log('    extended_file_folder_n', extended_file_folder_n);
    console.log('    extended_file_abs_path:', extended_file_abs_path);

    // var extends_file_js = glob.sync(extended_file_folder_n + '/**/scripts/**/*.js')
    // var extends_file_css = glob.sync(extended_file_folder_n + '/**/styles/**/*.css')

    folders_array.push(extended_file_folder_n);
    console.log(' >> folders_array:', folders_array);

    getFolderOfParentTemplate(folders_array, extended_file_abs_path);
    console.log('FINISH: script finishes!');
  };


  var copyParentAssets = function(file, destination) {
    var filename = file.path;
    var parentTemplatesFolders = [];

    gutil.log('\n>>> Stuff happened', 'Really it did', gutil.colors.yellow(filename));

    var rel_generated_content = './build/';
    var rel_source = './source/';
    var abs_generated_content = path.resolve(rel_generated_content);
    var abs_source = path.resolve(rel_source);
    gutil.log('abs_generated_content ==', gutil.colors.magenta(abs_generated_content));
    gutil.log('abs_source ==', gutil.colors.magenta(abs_source));

    getFolderOfParentTemplate(parentTemplatesFolders, filename);

    console.log('filename ==', filename);
    gutil.log('filename ==', gutil.colors.magenta(filename));
    console.log('destination ==', destination);
    gutil.log('destination ==', gutil.colors.magenta(destination));

    var exactDestination = destination + '/' + path.basename(filename, path.extname(filename));

    console.log('exactDestination ==', exactDestination);
    gutil.log('exactDestination ==', gutil.colors.magenta(exactDestination));

    var dest_js_folder = exactDestination + '/js/';
    var dest_css_folder = exactDestination + '/css/';
    var dest_img_folder = exactDestination + '/images/';
    var dest_fonts_folder = exactDestination + '/fonts/';
    gutil.log('dest_js_folder ==', gutil.colors.magenta(dest_js_folder));
    gutil.log('dest_css_folder ==', gutil.colors.magenta(dest_css_folder));
    gutil.log('dest_img_folder ==', gutil.colors.magenta(dest_img_folder));
    gutil.log('dest_fonts_folder ==', gutil.colors.magenta(dest_fonts_folder));

    parentTemplatesFolders.forEach(function(parent_folder_item, i) {
      gutil.log('\nparent_folder_item ==', gutil.colors.magenta(parent_folder_item));

      var parent_item_type = '';
      if (parent_folder_item.indexOf('base/') !== -1) {
        parent_item_type = 'base_layouts/';
      } else if (parent_folder_item.indexOf('sub/') !== -1) {
        parent_item_type = 'sub_layouts/';
      } else if (parent_folder_item.indexOf('pages/') !== -1) {
        parent_item_type = 'pages/';
      } else if (arent_folder_item.indexOf('components/') !== -1) {
        parent_item_type = 'components/';
      } else {
        gutil.log('ERROR: unknown item !!!', gutil.colors.red(parent_folder_item));
      }
      gutil.log('parent_item_type ==', gutil.colors.blue(parent_item_type));

      var parent_item_name = path.basename(parent_folder_item);
      gutil.log('parent_item_name ==', gutil.colors.blue(parent_item_name));

      var parent_js_glob = rel_generated_content + parent_item_type + parent_item_name + '/js/*.+(js|JS)';
      var parent_css_glob = rel_generated_content + parent_item_type + parent_item_name + '/css/*.+(css|CSS|css.map)';
      var parent_img_glob = rel_generated_content + parent_item_type + parent_item_name + '/images/*.+(png|jpg|jpeg|gif|svg|PNG|JPG|JPEG|GIF|SVG)';
      var parent_fonts_glob = rel_generated_content + parent_item_type + parent_item_name + '/fonts/*';
      gutil.log('parent_js_glob ==', gutil.colors.magenta(parent_js_glob));
      gutil.log('parent_css_glob ==', gutil.colors.magenta(parent_css_glob));
      gutil.log('parent_img_glob ==', gutil.colors.magenta(parent_img_glob));
      gutil.log('parent_fonts_glob ==', gutil.colors.magenta(parent_fonts_glob));

      var parent_js_files = glob.sync(parent_js_glob);
      var parent_css_files = glob.sync(parent_css_glob);
      var parent_img_files = glob.sync(parent_img_glob);
      var parent_fonts_files = glob.sync(parent_fonts_glob);
      gutil.log('parent_js_files ==', gutil.colors.magenta(parent_js_files));
      gutil.log('parent_css_files ==', gutil.colors.magenta(parent_css_files));
      gutil.log('parent_img_files ==', gutil.colors.magenta(parent_img_files));
      gutil.log('parent_fonts_files ==', gutil.colors.magenta(parent_fonts_files));

      parent_js_files.forEach(function(parent_file_item, i) {
        var parent_file_item_name = path.basename(parent_file_item);
        console.log('parent_file_item_name:', parent_file_item_name);
        gutil.log('parent_file_item_name ==', gutil.colors.magenta(parent_file_item_name));
        fs_ex.copySync(parent_file_item, dest_js_folder + parent_file_item_name);
      });

      parent_css_files.forEach(function(parent_file_item, i) {
        var parent_file_item_name = path.basename(parent_file_item);
        console.log('parent_file_item_name:', parent_file_item_name);
        gutil.log('parent_file_item_name ==', gutil.colors.magenta(parent_file_item_name));
        fs_ex.copySync(parent_file_item, dest_css_folder + parent_file_item_name);
      });

      parent_img_files.forEach(function(parent_file_item, i) {
        var parent_file_item_name = path.basename(parent_file_item);
        console.log('parent_file_item_name:', parent_file_item_name);
        gutil.log('parent_file_item_name ==', gutil.colors.magenta(parent_file_item_name));
        fs_ex.copySync(parent_file_item, dest_img_folder + parent_file_item_name);
      });

      parent_fonts_files.forEach(function(parent_file_item, i) {
        var parent_file_item_name = path.basename(parent_file_item);
        console.log('parent_file_item_name:', parent_file_item_name);
        gutil.log('parent_file_item_name ==', gutil.colors.magenta(parent_file_item_name));
        fs_ex.copySync(parent_file_item, dest_fonts_folder + parent_file_item_name);
      });
    });

    return file;  // возвращаем файл
  };


 var harvestBoundedAssets = function(options) {
   return through.obj(function(file, encoding, callback) {
     callback(null, copyParentAssets(file, options.dest));  // вторым аргументом нужно вернуть файл (из функции) иначе он пропадёт из потока
   });
 };

module.exports = harvestBoundedAssets;
