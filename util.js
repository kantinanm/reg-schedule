var http = require('http'); 
var iconv = require('iconv-lite');
var htmlToJson = require('html-to-json');
var querystring = require('querystring');

const isNumber = require('is-number');

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
 // process ok
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
			// mongo save

		 }


      console.log(scheduleList);

	  cb(courseList);
	  //console.log("query_subject :"+data);
	  //cb(data);
	});

	//cb(courseList);
		
};

var query_subject =   function(opt,cb) {

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
				 }, async function(err, result) {

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
								 //,'schedule':  callSchedule(result.links[i].href,opt.bc)
							  }

							  //courseList.push(tmp);

                              await  query_schedule(option.href,opt.bc,function(data) {


                              	  tmp["schedule"]=data;
                                  //console.log("result");
                                  //console.log(result);
                                  console.log("obj Tmp");
                                  console.log(tmp);

								  courseList.push(tmp);
                                  //data[i]['schedule']=result;
                              });

							 //courseList.push(obj);
						  }  // end check code = 6
					 } //end for

                	  console.log(courseList);
                	 await cb(courseList)
				});

		  });

}


var query_schedule =  function(url,bc,cb) {

  var url_path = 'http://www.reg2.nu.ac.th/registrar/'+url;

	    getUTF8(url_path,function(utf8) {
		htmlToJson.parse(utf8, {
				 'output': ['td', function($tr) {
					 //console.log("query_section :"+$tr.text());
				   var tmp = {
					 'text':$tr.text()
				   };
						return tmp;
				 }] 
				 }, function(err, result) {

					var section_info =[];
					var eng,thai,dep,unit,code;
					var codeIndex=0;
	
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

						if(result.tr[i].text==bc){
						 var tmpSchedule = {
                             'eng':eng,
                             'thai':thai,
                             'dep':dep,
                             'unit':unit,
                             'code':code,
                            'date':result.output[i-3].text,
							'start':result.output[i-2].text,
							'room':result.output[i-1].text
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

async function callSchedule(url,bc){
  /*
		var tmpSchedule = {
                'date':"",
				'start':"",
				'room':"",
          }

	return tmpSchedule;*/


     var url_path = 'http://www.reg2.nu.ac.th/registrar/'+url;

    await getUTF8(url_path,function(utf8) {
		htmlToJson.parse(utf8, {
				 'output': ['td', function($tr) {
					 //console.log("query_section :"+$tr.text());
				   var tmp = {
					 'text':$tr.text()
				   };
						return tmp;
				 }] 
				 }, function(err, result) {

					var section_info =[];
					//var section_info =[];
					var eng,thai,dep,unit,code;
					var codeIndex=0;

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

					 	if(result.tr[i].text==bc){
						 var tmpSchedule = {
                             'eng':eng,
                             'thai':thai,
                             'dep':dep,
                             'unit':unit,
                             'code':code,
                            'date':result.output[i-3].text,
							'start':result.output[i-2].text,
							'room':result.output[i-1].text
                          }
							//console.log("var tmpSchedule :"+tmpSchedule);
							 section_info.push(tmpSchedule);
						}
					 }
           			  //cb(section_info);
					return section_info;
				});
		  });

}
exports.callData = function(opt,cb) {
// process ok

    var url_path = 'http://www.reg2.nu.ac.th/registrar/room_time.asp?f_cmd=1&campusid=65&bc='+opt.bc+'&roomid='+opt.room_id+'&acadyear='+opt.year+'&firstday=4/9/2561&semester='+opt.semeter;


    var options = {
        hostname:'www.reg2.nu.ac.th',
        path:'/registrar/room_time.asp?f_cmd=1&campusid=65&bc='+opt.bc+'&roomid='+opt.room_id+'&acadyear='+opt.year+'&firstday=4/9/2561&semester='+opt.semeter,
        method:'GET'
		,headers: {

        }
    };


    var req = http.request(options, function(res) {
        toUTF8(res,function(utf8str) {
            htmlToJson.parse(utf8str, {
                'links': ['a', function($a) {
                    var tmp = {
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

                        var tmp = {
                            //'title' :result.links[i].title,
                            'code':result.links[i].text,
                            'href':result.links[i].href
                            //,'schedule':  callSchedule(result.links[i].href,opt.bc)
                        }

                        courseList.push(tmp);
                        //courseList.push(obj);
                    }  // end check code = 6
                } //end for


                prepair_schedule(courseList,opt,cb);

                /*prepair_schedule(courseList,opt.bc,function(data) {
                	console.log("map item.");
                	cb(data);
				});*/

            });
        });
    });

    req.end();

}

var prepair_schedule =   function(obj,opt,cb) {

    for(i=0;i<obj.length;i++){
         retrieveData(obj[i].href,opt,function(result){
        	cb(result);
		});
	}

}

var retrieveData = function(url,opt,cb) {
    //cb({'date':'1'});

    var options = {
        hostname:'www.reg2.nu.ac.th',
        path:'/registrar/'+url,
        method:'GET'
        ,headers: {

        }
    };

    var req = http.request(options, function(res) {
        toUTF8(res,function(utf8str) {
            htmlToJson.parse(utf8str, {
                'output': ['td', function($tr) {
                    //console.log("query_section :"+$tr.text());
                    var tmp = {
                        'text':$tr.text()
                    };
                    return tmp;
                }]
            }, function(err, result) {
                var section_info =[];
                var eng,thai,dep,unit,code_in;
                var codeIndex=0;



                for(var i=0;i<result.output.length;i++) {

                    if((isNumber(result.output[i].text))&(result.output[i].text.length==6)){
                        code_in=result.output[i].text;
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

                    if(result.output[i].text==opt.bc){
                        var tmpSchedule = {
                            'eng':eng,
                            'thai':thai,
                            'dep':dep,
                            'unit':unit,
                            'code':code_in,
                            //'course':code,
                        	'date':result.output[i-3].text,
                            'start':result.output[i-2].text,
                            'room':result.output[i-1].text,
                            'building':opt.bc,
                            'year':opt.year,
                            'semeter':opt.semeter

                        }
                        //console.log("var tmpSchedule :"+tmpSchedule);
                        section_info.push(tmpSchedule);
                    }
                }
				cb(section_info);
            });
        });

    });
    req.end();
}







