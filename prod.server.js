var express = require("express");

var port = "8080";
var opn = require('opn')
var app = express();
var router = express.Router();
router.get('/',function (req,res,next) {
	req.url = '/index.html';
	next();
});
app.use(router);
var apiRoutes = express.Router();
apiRoutes.get('/test',function (req,res) {
  /* body... */
  res.json({
    errorno:0,
    data:"test",
    });
});
app.use('/api',apiRoutes);
app.use(express.static('./src'));
var uri = "http://localhost:"+port;
module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err);
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
});
opn(uri)