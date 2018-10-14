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

var execPHP = require('./execphp.js')();
execPHP.phpFolder = '.\\public\\phpfiles\\';

app.use('*.php',function(request,response,next) {
	execPHP.parseFile(request.originalUrl,function(phpResult) {
		response.write(phpResult);
		response.end();
	});
});

app.use(bodyParser.json());
app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get('/', function(req, res) {
    res.sendFile('public/schedule.html', { root: __dirname });
});


app.get('/building/:building', function (req, res) {
    //used ok
	 //req.params.building
	  util.getRoom(req.params.building,function(result) {
		res.json(result);
	  });


});

app.get('/db', function (req, res) {

    //used for get test db
    db.schedule.find(function(err, docs) {
        res.json(docs);
    });

});



app.get('/schedule/:building/:room_id/:year/:semeter', async function (req, res) {
    //used for test db
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



    var data = await util.callData(opt,  function(result) {
        //setTimeout(res.json(result), 2000)
        console.log(result);
         //res.json(result);
        return result;
        /*db.schedule.insert(result, function(err, docs) {
            // insert completed
            console.log("callback give result.");
            console.log("insert completed.");
        });*/


    });

    res.json(data);
     /*
	  util.getSchedule(req.params.building,req.params.room_id,req.params.year,req.params.semeter,  function(result) {
          //setTimeout(res.json(result), 2000)
          res.json(result);

          console.log(result);
          //result.then(res.render('home',{'data':result,'pass':'561'}));
           //res.render('home',{'data':result,'pass':'561'});
          //res.writeHead(200, {"Content-Type": "application/json"});
          //res.end(JSON.stringify(result));

          //db.schedule.insert(result, function(err, docs) {
              // insert completed
          //    console.log("insert completed.");
          //});

	  });
    */

});

app.get('/test', function (req, res) {
    //used for test

    /*util.testData().then(function(data){
     res.json(data);
     });*/

    var opt ={
        'bc':'EE',
        'room_id':'2565',
        'year':'2561',
        'semeter':'1',
    }

     //var url ='class_info_2.asp?backto=room_time&option=1&courseid=18427&classid=354831&acadyear=2561&semester=1&normalURL=f%5Fcmd%3D1%26campusid%3D65%26campusname%3D%26bc%3DEE%26bn%3D%26roomid%3D2565%26acadyear%3D2561%26firstday%3D4%2F9%2F2561%26semester%3D1';

    /*util.retrieveDataPromise(url,opt).then(function(data){
        res.json(data);
    });*/
    util.getRoomTable(opt.bc,opt.room_id,opt.year,opt.semeter,function(result) {

        res.json(result);

    })


});

app.get('/schedule2/:building/:room_id/:year/:semeter', function (req, res) {

    var opt ={
        'bc':req.params.building,
        'room_id':req.params.room_id,
        'year':req.params.year,
        'semeter':req.params.semeter,
    }

    util.promiseData(opt).then(async function(result){


            var section_info =[];
            var counter =1;
            for(var i=0;i<result.length;i++) {
                await  util.retrieveDataPromise(result[i].href, opt).then(function (data) {
                        section_info.push(data);
                        counter++;
                    //console.log(result.findIndex(data[0].code));
                    });

            }

        res.json(section_info);

        //res.json(result);
    })

});

app.get('/section', function (req, res) {

        //used for test
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

//app.get('/room/:section', function (req, res) {
app.get('/room', function (req, res) {
  	var url_path ='http://reg2.nu.ac.th/registrar/class_info_1.asp?printfriendly=1&coursestatus=O00&facultyid=207';
        url_path+='&maxrow=500&acadyear=2561&semester=1&coursecode=&cmd=2&avs685944429=19&backto=home';
        //url_path+='&maxrow=500&acadyear=2561&semester=1&coursecode='+req.params.section+'*&cmd=2&avs685944429=19&backto=home';
		getUTF8(url_path,function(utf8) {
		htmlToJson.parse(utf8, {
				 'output': ['td', function($tr) {
					//console.log($tr.text());
					   var tmp = {
						 'text':$tr.text()
					   };
						return tmp;
				 }]
				 }, function(err, result) {
           var list=[];
           var code,datetime;
           for(var i=22;i<result.output.length-15;i++) {
               if(result.output[i].text.substring(0,2) == "SU"){
                 code=result.output[i-3].text.trim().substring(0,6);
                 datetime=result.output[i].text;
                 i+=10;
               }else if(result.output[i].text.substring(0,2) == "MO"){
                 code=result.output[i-3].text.trim().substring(0,6);
                 datetime=result.output[i].text;
                 i+=10;
               }else if(result.output[i].text.substring(0,2) == "TU"){
                 code=result.output[i-3].text.trim().substring(0,6);
                 datetime=result.output[i].text;
                 i+=10;
               }else if(result.output[i].text.substring(0,2) == "WE"){
                 code=result.output[i-3].text.trim().substring(0,6);
                 datetime=result.output[i].text;
                 i+=10;
               }else if(result.output[i].text.substring(0,2) == "TH"){
                 code=result.output[i-3].text.trim().substring(0,6);
                 datetime=result.output[i].text;
                 i+=10;
               }else if(result.output[i].text.substring(0,2) == "FR"){
                 code=result.output[i-3].text.trim().substring(0,6);
                 datetime=result.output[i].text;
                 i+=10;
               }else if(result.output[i].text.substring(0,2) == "SA"){
                 code=result.output[i-3].text.trim().substring(0,6);
                 datetime=result.output[i].text;
                 i+=10;
               }else if(result.output[i].text == ""){
                 code="000000";
                 datetime="FF";
                 i+=10;
               }

               var tmpSchedule = {
                 'code':code,
                 'dates':datetime
               }
               list.push(tmpSchedule);
					 }
           res.json(list)
				});
		  });
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
