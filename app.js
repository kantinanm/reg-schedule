var express = require('express');
var bodyParser = require('body-parser');
var htmlToJson = require('html-to-json');
var http = require('http');
var util = require('./util');
var app = express();
var path = require('path');
var iconv = require('iconv-lite');
var condb = require('./db/connectdb');
var bodyParser = require('body-parser');
const isNumber = require('is-number');

var mongojs = require('./db');
var db = mongojs.connect;

db.on('error', function (err) {
  console.log('database error', err)
});

db.on('connect', function () {
  console.log('database connected')
});

app.use(bodyParser.urlencoded({ extended: true }));

var execPHP = require('./execphp.js')();
execPHP.phpFolder = '.\\public\\phpfiles\\';

app.use('*.php', function (request, response, next) {
  execPHP.parseFile(request.originalUrl, function (phpResult) {
    response.write(phpResult);
    response.end();
  });
});

app.get('/time', function (req, res) {
  res.json(new Date().getTime());
});

app.post('/login', function (req, res) {
  var opt = {
    'username': req.body.txtUsr,
    'password': req.body.txtPwd,
  }
  condb.ldaplogin(opt, function (result) {
    res.json(result);
  });
});

app.post('/insert', function (req, res) {
  condb.InsertDB(req.body, function (result) {
    res.json(result);
  });
});

app.post('/confirmroom', function (req, res) {
  condb.ConfirmRoom(req.body, function (result) {
    res.json(result);
  });
});

app.post('/delete', function (req, res) {
  condb.DeleteDB(req.body, function (result) {
    res.json(result);
  });
});

app.get("/user", function (req, res) {
  condb.listUser(function (result) {
    res.json(result);
  });
});

app.post("/bookroom", function (req, res) {
  condb.listBookRoom(req.body, function (result) {
    res.json(result);
  });
});

app.use(bodyParser.json());
app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get('/', function (req, res) {
  res.sendFile('public/index.html', { root: __dirname });
});


app.get('/building/:building', function (req, res) {
  //used ok
  util.getRoom(req.params.building, function (result) {
    res.json(result);
  });
});

app.get('/db', function (req, res) {
  //used for get test db
  db.schedule.find(function (err, docs) {
    res.json(docs);
  });

});



app.get('/schedule/:building/:room_id/:year/:semeter', async function (req, res) {
  //used for test db
  var opt = {
    'bc': req.params.building,
    'room_id': req.params.room_id,
    'year': req.params.year,
    'semeter': req.params.semeter,
  }
  var data = await util.callData(opt, function (result) {
    return result;
  });
  res.json(data);
});

app.get('/test', function (req, res) {
  var opt = {
    'bc': 'EE',
    'room_id': '2565',
    'year': '2561',
    'semeter': '1',
  }
  util.getRoomTable(opt.bc, opt.room_id, opt.year, opt.semeter, function (result) {
    res.json(result);
  })
});

app.get('/schedule2/:building/:room_id/:year/:semeter', function (req, res) {
  var opt = {
    'bc': req.params.building,
    'room_id': req.params.room_id,
    'year': req.params.year,
    'semeter': req.params.semeter,
  }
  util.promiseData(opt).then(async function (result) {
    var section_info = [];
    var counter = 1;
    for (var i = 0; i < result.length; i++) {
      await util.retrieveDataPromise(result[i].href, opt).then(function (data) {
        section_info.push(data);
        counter++;
      });
    }
    res.json(section_info);
  })
});

app.get('/section', function (req, res) {
  var url_path = 'http://www.reg2.nu.ac.th/registrar/class_info_2.asp?backto=room_time&option=1&courseid=20044&classid=355200&acadyear=2561&semester=1';
  getUTF8(url_path, function (utf8) {
    htmlToJson.parse(utf8, {
      'output': ['td', function ($tr) {
        var tmp = {
          'text': $tr.text()
        };
        return tmp;
      }]
    }, function (err, result) {
      var aList = [];
      var eng, thai, dep, unit, code, sec;
      var codeIndex = 0;
      for (var i = 0; i < result.output.length; i++) {

        if ((isNumber(result.output[i].text)) & (result.output[i].text.length == 6)) {
          code = result.output[i].text;
          codeIndex = i;
        }

        if (codeIndex + 1 == i) {
          eng = result.output[i].text;
        }

        if (codeIndex + 3 == i) {
          thai = result.output[i].text;
        }

        if (codeIndex + 6 == i) {
          dep = result.output[i].text;
        }

        if (codeIndex + 9 == i) {
          unit = result.output[i].text;
        }

        if (result.output[i].text == "EE") {
          var tmpSchedule = {
            'eng': eng,
            'thai': thai,
            'dep': dep,
            'unit': unit,
            'code': code,
            //'sec':result.output[i-5].text,
            'text': result.output[i - 3].text,
            'start': result.output[i - 2].text,
            'room': result.output[i - 1].text.trim()
          }
          aList.push(tmpSchedule);
        } // end if
      } // end for
      // res.json(aList) // see selected obj
      res.json(result) // see result all parse html
    });
  });
});

app.get('/room', function (req, res) {
  var url_path = 'http://reg2.nu.ac.th/registrar/class_info_1.asp?printfriendly=1&coursestatus=O00&facultyid=207';
  url_path += '&maxrow=500&acadyear=2561&semester=1&coursecode=&cmd=2&avs685944429=19&backto=home';
  getUTF8(url_path, function (utf8) {
    htmlToJson.parse(utf8, {
      'output': ['td', function ($tr) {
        var tmp = {
          'text': $tr.text()
        };
        return tmp;
      }]
    }, function (err, result) {
      var list = [];
      var code, subject, datetime;
      for (var i = 22; i < result.output.length - 15; i++) {
        if (result.output[i].text.substring(0, 2) == "SU") {
          code = result.output[i - 3].text.trim().substring(0, 6);
          subject = result.output[i - 2].text;
          datetime = result.output[i].text;
          i += 10;
        } else if (result.output[i].text.substring(0, 2) == "MO") {
          code = result.output[i - 3].text.trim().substring(0, 6);
          subject = result.output[i - 2].text;
          datetime = result.output[i].text;
          i += 10;
        } else if (result.output[i].text.substring(0, 2) == "TU") {
          code = result.output[i - 3].text.trim().substring(0, 6);
          subject = result.output[i - 2].text;
          datetime = result.output[i].text;
          i += 10;
        } else if (result.output[i].text.substring(0, 2) == "WE") {
          code = result.output[i - 3].text.trim().substring(0, 6);
          subject = result.output[i - 2].text;
          datetime = result.output[i].text;
          i += 10;
        } else if (result.output[i].text.substring(0, 2) == "TH") {
          code = result.output[i - 3].text.trim().substring(0, 6);
          subject = result.output[i - 2].text;
          datetime = result.output[i].text;
          i += 10;
        } else if (result.output[i].text.substring(0, 2) == "FR") {
          code = result.output[i - 3].text.trim().substring(0, 6);
          subject = result.output[i - 2].text;
          datetime = result.output[i].text;
          i += 10;
        } else if (result.output[i].text.substring(0, 2) == "SA") {
          code = result.output[i - 3].text.trim().substring(0, 6);
          subject = result.output[i - 2].text;
          datetime = result.output[i].text;
          i += 10;
        } else if (result.output[i].text == "") {
          code = "000000";
          subject = "subject";
          datetime = "FF";
          i += 10;
        }

        var tmpSchedule = {
          'code': code,
          'subject': subject,
          'dates': datetime
        }
        list.push(tmpSchedule);
      }
      res.json(list)
    });
  });
});

app.get('/subject/:section', function (req, res) {
  var url_path = 'http://reg2.nu.ac.th/registrar/class_info_1.asp?printfriendly=1&coursestatus=O00&facultyid=207';
  url_path += '&maxrow=500&acadyear=2561&semester=1&coursecode=' + req.params.section + '*&cmd=2&avs685944429=19&backto=home';
  getUTF8(url_path, function (utf8) {
    htmlToJson.parse(utf8, {
      'output': ['td', function ($tr) {
        var tmp = {
          'text': $tr.text()
        };
        return tmp;
      }]
    }, function (err, result) {
      var list = [];
      var code, subject;
      for (var i = 30; i < result.output.length - 15; i++) {
        if (result.output[i].text.trim().substring(0, 3) === req.params.section) {
          code = result.output[i].text.trim().substring(0, 6);
          subject = result.output[i + 1].text
        } else {
          code = "000000";
          subject = "subject";
        }
        var tmpSchedule = {
          'code': code,
          'subject': subject
        }
        list.push(tmpSchedule);
      }
      res.json(list)
    });
  });
});

var getUTF8 = function (url_path, cb) {
  http.get(url_path, function (res) {
    var str = [];
    res.on('data', function (chunk) {
      str.push(chunk);
    });

    res.on('end', function () {
      var total = 0;
      for (var i = 0; i < str.length; i++) {
        total += str[i].length;
      }
      var content = Buffer.concat(str, total);
      var utf8st = iconv.decode(content, 'win874');
      cb(utf8st); //utf8st
    });
  });
};


var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Starting node.js on port ' + port);
});
