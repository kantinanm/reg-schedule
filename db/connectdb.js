var ldap = require('ldapjs');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "reg-schedule"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

exports.listUser = function (res) {
  con.query("SELECT * FROM tb_users", function (err, rows, fields) {
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
    con.query("SELECT * FROM tb_users WHERE internet_account='" + opt.username + "'", function (err, rows) {
      //con.end();
      if (!err) res(rows);
      else res(null); // or response something
    });
  });
};

exports.InsertDB = function (opt, res) {
  var sql = "INSERT INTO schedule(code,col,dates,start,end,span,room,internet_account,approve)";
  sql += " VALUES ('" + opt.cboSubject + "', '" + opt.col + "', " + opt.ondate + ", '" + opt.startTime + "', '" + opt.endTime + "', '" + opt.span + "', '" + opt.onRoom + "','" + opt.user + "',0)";
  con.query(sql, function (err, result) {
    if (err) res(null);
    else res(result);
  });
}

exports.listBookRoom = function (opt, res) {
  con.query("SELECT * FROM schedule", function (err, rows) {
    if (err) res(null);
    else res(rows);
  });
};

exports.ConfirmRoom = function (opt, res) {
  var sql = "UPDATE schedule SET approve=" + opt.approve + " WHERE schedule_id='" + opt.id + "' ";
  con.query(sql, function (err, result) {
    if (err) res(null);
    else res(result);
  });
}

exports.DeleteDB = function (opt, res) {
  var sql = "UPDATE schedule SET approve=3 WHERE schedule_id='" + opt.id + "' ";
  con.query(sql, function (err, result) {
    if (err) res(null);
    else res(result);
  });
}