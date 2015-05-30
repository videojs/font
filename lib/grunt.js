var fs = require('fs');
var _ = require('lodash');

module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'css/videojs-icons.css': 'scss/videojs-icons.scss'
        }
      }
    }
  });

  grunt.registerTask('generate-font', function() {
    var done = this.async();

    let webfontsGenerator = require('webfonts-generator');
    let iconConfig = require('../icons.json');
    let svgRootDir = iconConfig['svg-dir'];
    let icons = iconConfig.icons;

    let iconFiles = Object.keys(icons).map(function(icon) {
      return svgRootDir + icons[icon].svg;
    });

    webfontsGenerator({
      files: iconFiles,
      dest: 'fonts/',
      fontName: iconConfig['font-name'],
      cssDest: 'scss/_icons.scss',
      cssTemplate: './templates/scss.hbs',
      rename: function(path) {
        path = path.replace(svgRootDir, '');

        let iconName = _.result(_.find(icons, function(icon) {
          return icon.svg === path;
        }), 'name');

        return iconName;
      },
      types: ['svg', 'ttf', 'woff', 'eot']
    }, function(error) {
      if (error) done(false);

      done();
    });

  });

  grunt.registerTask('update-base64', function() {
    let iconScssFile = './scss/_icons.scss';
    let fontFiles = {
      ttf: './fonts/VideoJS.ttf',
      woff: './fonts/VideoJS.woff'
    };

    let scssContents = fs.readFileSync(iconScssFile).toString();

    Object.keys(fontFiles).forEach(function(font) {
      let fontFile = fontFiles[font];
      let fontContent = fs.readFileSync(fontFile);

      let regex = new RegExp(`(url.*font-${font}.*base64,)([^\\s]+)(\\).*)`);

      scssContents = scssContents.replace(regex, `$1${fontContent.toString('base64')}$3`);
    });

    fs.writeFileSync(iconScssFile, scssContents);
  });

  grunt.registerTask('default', ['generate-font', 'update-base64', 'sass']);
};
