var http = require('http'); 
var iconv = require('iconv-lite');
var htmlToJson = require('html-to-json');
var querystring = require('querystring');

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

var toUTF8 = function(res,cb) {
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
    cb(utf8st);
  });
};



exports.getData = function(url_path,cb) {
  http.get(url_path , function(res) {
		var str = [];
		res.on('data', function(chunk) {
		   str.push(chunk);
		   console.log('data: ' + chunk)
		});
		res.on('end', function() {
		  var total = 0;
		  for(var i=0;i<str.length;i++) {
			total+=str[i].length;
		  }
		  var content = Buffer.concat(str,total);
		  output=content;
		   console.log('end: '+content);  
			//response.send(JSON.stringify(content));
			cb(content);
	   });
	 });

};

exports.getRoom = function(bc,cb) {

	 var url_path = 'http://www.reg2.nu.ac.th/registrar/room_time.asp?f_cmd=1&campusid=65&bc='+bc;
		
		getUTF8(url_path,function(utf8) {
		htmlToJson.parse(utf8, {
				 'option': ['option', function($op) {
					console.log($op.text());
				    var count =$op.parents().children("option").length;
					console.log("length :"+$op.parents().children("option").length);
			
				   var tmp = {
					 'value':$op.attr('value'),
					 'text':$op.text()
				   };
					return tmp;
				 }] 
				 }, function(err, result) {

					var room_list =[];

					 for(var i=0;i<result.option.length;i++) {
                          var tmp = {
                            'title' :result.option[i].text,
                            'room_id':result.option[i].value
                          }
                         room_list.push(tmp);
					 }

					 console.log(room_list);
					 cb(room_list)
				});

		  });

};


exports.getRoomTable = function(bc,room_id,year,semeter,cb) {


	  var url_path = 'http://www.reg2.nu.ac.th/registrar/room_time.asp?f_cmd=1&campusid=65&bc='+bc+'&roomid='+room_id+'&acadyear='+year+'&firstday=4/9/2561&semester='+semeter;
		
		getUTF8(url_path,function(utf8) {
		htmlToJson.parse(utf8, {
				 'links': ['a', function($a) {

					//console.log($a.text()+" length "+$a.text().length);
				    //console.log("title :"+$a.attr('TITLE'));
			
				   var tmp = {
					 //'title':$a.attr('title'),
					 'text':$a.text(),
				     'href':$a.attr('href')
				   };

						return tmp;
				 }] 
				 }, function(err, result) {

					var courseList =[];
					
					//res.json(result);
					 for(var i=0;i<result.links.length;i++) {
						  if(result.links[i].text.length==6){
						  var option ={'href':result.links[i].href}
					      var objAgrs=result.links[i];
								
							/* var data=query_section(option,objAgrs,function(section_info) {
								return section_info;
							 });*/
							 
							  var tmp = {
								//'title' :result.links[i].title,
								'code':result.links[i].text,
								'href':result.links[i].href

							  }
							
							 courseList.push(tmp);
						  }  // end check code = 6
					 } //end for

					 console.log(courseList);
					 cb(courseList)
				});

		  });

};


exports.getSchedule = function(bc,room_id,year,semeter,cb) {

	 var courseList =[];
	 var option ={
	    'bc':bc,
	    'room_id':room_id,
		'year':year,
		'semeter':semeter,
	  }

	query_subject(option,function(data) {


	  var scheduleList =[];
		 for(var i=0;i<data.length;i++) {
				  var tmp = {
						'code':data[i].code,
                        'href':data[i].href
						/*,'schedule':callSchedule(data[i].href,bc,function(result) {
						    console.log(result);
							return result;
					   })*/
				  }

			query_schedule(data[i].href,bc,function(result) {
				 tmp["tmp"]=result;
                console.log("result");
				 console.log(result);
                scheduleList.push(result);
				//data[i]['schedule']=result;
			});


			console.log(tmp);
			courseList.push(tmp);


		 }


      console.log(scheduleList);
	  cb(courseList);
	  //console.log("query_subject :"+data);
	  //cb(data);
	});

	//cb(courseList);
		
};

var query_subject = function(opt,cb) {

    var url_path = 'http://www.reg2.nu.ac.th/registrar/room_time.asp?f_cmd=1&campusid=65&bc='+opt.bc+'&roomid='+opt.room_id+'&acadyear='+opt.year+'&firstday=4/9/2561&semester='+opt.semeter;

		getUTF8(url_path,function(utf8) {
		htmlToJson.parse(utf8, {
				 'links': ['a', function($a) {
					//console.log($a.text()+" length "+$a.text().length);
				    //console.log("title :"+$a.attr('TITLE'));
				   var tmp = {
					 //'title':$a.attr('title'),
					 'text':$a.text(),
				     'href':$a.attr('href')
				   };

						return tmp;
				 }] 
				 }, function(err, result) {

					var courseList =[];
					
					//res.json(result);
					 for(var i=0;i<result.links.length;i++) {
						  if(result.links[i].text.length==6){
						  var option ={'href':result.links[i].href}
					      var objAgrs=result.links[i];
								
							/* var data=query_section(option,objAgrs,function(section_info) {
								return section_info;
							 });*/
							 
							  var tmp = {
								//'title' :result.links[i].title,
								'code':result.links[i].text,
								'href':result.links[i].href,
								'schedule':[]
							  }
							
							 courseList.push(tmp);
						  }  // end check code = 6
					 } //end for

					 console.log(courseList);
					 cb(courseList)
				});

		  });

}


var query_schedule = function(url,bc,cb) {

  var url_path = 'http://www.reg2.nu.ac.th/registrar/'+url;

	    getUTF8(url_path,function(utf8) {
		htmlToJson.parse(utf8, {
				 'tr': ['td', function($tr) {
					 //console.log("query_section :"+$tr.text());
				   var tmp = {
					 'text':$tr.text()
				   };
						return tmp;
				 }] 
				 }, function(err, result) {

					var section_info =[];
	
					 for(var i=0;i<result.tr.length;i++) {
						if(result.tr[i].text==bc){
						 var tmpSchedule = {
                            'date':result.tr[i-3].text,
							'start':result.tr[i-2].text,
							'room':result.tr[i-1].text
                          }
							//console.log("var tmpSchedule :"+tmpSchedule);
							 section_info.push(tmpSchedule);
						}
					 }
						
						//console.log("section_info :"+tmpSchedule);
					 cb(section_info);//section_info
				});
		  });

}

function callSchedule(url,bc,cb){
  /*
		var tmpSchedule = {
                'date':"",
				'start':"",
				'room':"",
          }

	return tmpSchedule;*/


     var url_path = 'http://www.reg2.nu.ac.th/registrar/'+url;

	    getUTF8(url_path,function(utf8) {
		htmlToJson.parse(utf8, {
				 'tr': ['td', function($tr) {
					 //console.log("query_section :"+$tr.text());
				   var tmp = {
					 'text':$tr.text()
				   };
						return tmp;
				 }] 
				 }, function(err, result) {

					var section_info =[];
	
					 for(var i=0;i<result.tr.length;i++) {
						if(result.tr[i].text==bc){
						 var tmpSchedule = {
                            'date':result.tr[i-3].text,
							'start':result.tr[i-2].text,
							'room':result.tr[i-1].text
                          }
							//console.log("var tmpSchedule :"+tmpSchedule);
							 section_info.push(tmpSchedule);
						}
					 }
					cb(section_info);
				});
		  });

}







