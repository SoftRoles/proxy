var express = require('express')
var bodyParser = require("body-parser")
var cors = require("cors")

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get("/app2", function(req,res){
	console.log(req.headers)
	if(req.headers.Authorization) res.send(req.headers.Authorization.replace("Bearer ",""))
	if(req.headers.authorization) res.send(req.headers.authorization.replace("Bearer ",""))
	else res.send("No user exists")
})

app.listen(2991, function () {
  console.log("Service running on http://127.0.0.1:2991")
})
