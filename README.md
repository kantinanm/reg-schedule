# reg-schedule
html2json parse data to collect and return json service with express.js , callback hell problem.

# Requirement
 node version 8 + , async, await supported. 
# How to install
go to upzip directory and cmd type : npm install

# Test URL
1.http://localhost:3000/building/{building} <-change {building}   eg. EE , EN ,CE ,IE
2.http://localhost:3000/schedule2/{building}/{room-id}/2561/1  <-change {building} and {room-id}  please see {room-id} in 1.url
 <br/>    <a href='http://localhost:3000/schedule2/EN/3951/2561/1' target='_blank'> http://localhost:3000/schedule2/EN/3951/2561/1 </a> <br/>
3.<a href='http://localhost:3000/section'> http://localhost:3000/section </a> for example htmlToJson 
# Return json 
1.Result for test 1. url : <a href='https://github.com/kantinanm/reg-schedule/blob/master/building.json' target='_blank'>building.json</a>
<br/>2.Result for test 2. url : <a href='https://github.com/kantinanm/reg-schedule/blob/master/schedule.json' target='_blank'>schedule.json</a>
