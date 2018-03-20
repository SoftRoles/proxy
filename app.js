var express = require('express')
var bodyParser = require("body-parser")
var cors = require("cors")
var notifier = require('node-notifier');

const PATH = require('path');
const dirTree = require('directory-tree');

//const tree = dirTree('./node_modules', {}, (item, PATH) => {
//	console.log(item);
//});

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(__dirname + "/test"))
app.listen(3001, function () {
    notifier.notify({
        title: 'Service: 3001-dirtree',
        message: "Started succesfully!",
        wait: true
    });
})

app.get("/", function (req, res) {
    res.sendFile("test/index.html", { root : __dirname})
})

app.post("/", function(req, res){
	console.log(req.body.path)
    res.send(dirTree(req.body.path))
})

app.get("/forwebixtreetable", function (req, res) {
	res.send(dirTree(req.query.path))
})

console.log(dirTree('c:\\Users\\Ev\\Desktop'))
