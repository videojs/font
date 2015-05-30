var fs = require('fs');

module.exports = function(grunt) {
  require('time-grunt')(grunt);

  /**
   * Eventually this file should generate the Base64 encoded versions of the ttf and woff files and replace
   * what's in _icons.scss
   */

   grunt.registerTask('base64_encode', function() {
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

   grunt.registerTask('default', []);
};
