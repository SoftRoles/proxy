const PATH = require('path');
const dirTree = require('directory-tree');

//const tree = dirTree('./node_modules', {}, (item, PATH) => {
//	console.log(item);
//});
console.log(dirTree('./node_modules'))
