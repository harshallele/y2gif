/*Module to check if a conversion is complete*/


var fs = require('fs');
//check if a '.complete' file is present in the data folder of this conversion
exports.checkJob = function (params) {
    var id = params.split('=')[1];
    var filePath = './data/'+ id + '/.complete';
    return fs.existsSync(filePath);
}
