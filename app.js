var express = require('express');
var bodyParser = require('body-parser');
var htmlToJson = require('html-to-json');
var http = require('http'); 
var util = require('./util');
var app = express();
var path = require('path');
var iconv = require('iconv-lite');
//var public = path.join(__dirname, 'public');
const isNumber = require('is-number');

var mongojs = require('./db');
var db = mongojs.connect;

db.on('error', function (err) {
    console.log('database error', err)
});

db.on('connect', function () {
    console.log('database connected')
});



app.use(bodyParser.json());
app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get('/', function(req, res) {
    res.sendFile('public/index.html', { root: __dirname });
});


app.get('/building/:building', function (req, res) {
	 
	 //req.params.building
	  util.getRoom(req.params.building,function(result) {
		res.json(result);
	  });


});

app.get('/db', function (req, res) {

    db.schedule.find(function(err, docs) {
        res.json(docs);
    });

});



app.get('/schedule/:building/:room_id/:year/:semeter', function (req, res) {
	 
	 //req.params.building
	  /*util.getRoomTable(req.params.building,req.params.room_id,req.params.year,req.params.semeter,function(result) {  
		res.json(result);
	  });*/

    var opt ={
        'bc':req.params.building,
        'room_id':req.params.room_id,
        'year':req.params.year,
        'semeter':req.params.semeter,
    }

    util.callData(opt, function(result) {
        //setTimeout(res.json(result), 2000)
        console.log(result);
        //res.json(result);

        /*db.schedule.insert(result, function(err, docs) {
            // insert completed
            console.log("callback give result.");
            console.log("insert completed.");
        });*/



    });

	  /*util.getSchedule(req.params.building,req.params.room_id,req.params.year,req.params.semeter,  function(result) {

          //setTimeout(res.json(result), 2000)
          //res.json(result);

          //console.log(result);
          //result.then(res.render('home',{'data':result,'pass':'561'}));
           res.render('home',{'data':result,'pass':'561'});
          //res.writeHead(200, {"Content-Type": "application/json"});
          //res.end(JSON.stringify(result));

          db.schedule.insert(result, function(err, docs) {
              // insert completed
              console.log("insert completed.");
          });

	  });*/



});


app.get('/section', function (req, res) {

	    //var url_path = 'http://www.reg2.nu.ac.th/registrar/class_info_2.asp?backto=room_time&option=1&courseid=16162&classid=352916&acadyear=2561&semester=1';
    	var url_path ='http://www.reg2.nu.ac.th/registrar/class_info_2.asp?backto=room_time&option=1&courseid=20044&classid=355200&acadyear=2561&semester=1';
		getUTF8(url_path,function(utf8) {
		htmlToJson.parse(utf8, {
				 'output': ['td', function($tr) {
					console.log($tr.text());
				  
					   var tmp = {
						 'text':$tr.text()
					   };
						return tmp;

				 }] 
				 }, function(err, result) {

					var aList =[];
					var eng,thai,dep,unit,code,sec;
					var codeIndex=0;
					//res.json(result);
					 for(var i=0;i<result.output.length;i++) {

					 	if((isNumber(result.output[i].text))&(result.output[i].text.length==6)){
                            code=result.output[i].text;
                            codeIndex=i;
						}

						if(codeIndex+1==i){
                             eng=result.output[i].text;
						}

						if(codeIndex+3==i){
                             thai=result.output[i].text;
						}

                         if(codeIndex+6==i){
                             dep=result.output[i].text;
                         }

                         if(codeIndex+9==i){
                             unit=result.output[i].text;
                         }

						if(result.output[i].text=="EE"){
						 var tmpSchedule = {
						 	'eng':eng,
						 	'thai':thai,
							 'dep':dep,
						 	'unit':unit,
						 	'code':code,
						 	//'sec':result.output[i-5].text,
						 	'text':result.output[i-3].text,
							'start':result.output[i-2].text,
							'room':result.output[i-1].text.trim()
		
                          }
					
							 aList.push(tmpSchedule);
						} // end if


						  
					 } // end for

					 console.log(aList);
					// res.json(aList) // see selected obj
					 res.json(result) // see result all parse html
				});
		  });

   //console.log(url_path);
});

var getUTF8 = function(url_path,cb) {
  http.get(url_path , function(res) {
    var str = [];
    res.on('data', function(chunk) {
      str.push(chunk);
    });

    res.on('end', function() {
      var total = 0;
      for(var i=0;i<str.length;i++) {
        total+=str[i].length;
      }
      var content = Buffer.concat(str,total);
      var utf8st=iconv.decode(content,'win874');
      cb(utf8st); //utf8st
   });
 });
};


var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
	
	
});