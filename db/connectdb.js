var ldap = require('ldapjs');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "reg-schedule"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

exports.listUser = function(res) {
  con.query("SELECT * from tb_users", function(err, rows, fields) {
    if (!err)
      res(rows);
    else
      console.log('Error while performing Query.');
    });
};

exports.ldaplogin = function (opt, res) {
  var client = ldap.createClient({ url: 'ldap://dc-03-svr' });
  client.bind('nu\\' + opt.username, opt.password, function (err) {
    client.unbind();
    if (err !== null) return res(null); // or response something
    con.query("SELECT * from tb_users WHERE internet_account='" + opt.username + "'", function (err, rows, fields) {
      //con.end();
      if (!err) res(rows);
      else res(null); // or response something
    });
  });
};

exports.InsertDB = function (opt, res) {
    var sql = "INSERT INTO schedule(sub_id,col,dates,start,end,span,room,internet_account)";
        sql +=" VALUES ('"+opt.cboSubject+"', '"+opt.col+"', '"+opt.ondate+"', '"+opt.startTime+"', '"+opt.endTime+"', '"+opt.span+"', '"+opt.onRoom+"','"+opt.user+"')";
    con.query(sql, function (err, result) {
      if (err) res(null);
      else res(result);
    });
}
