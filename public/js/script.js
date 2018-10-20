function getSubject(opt){
  var subject = [];
  var data = uniqueSub(opt);
  var id = $("#cboSection").val();
  $.each(data, function(key, value) {
    if(value.code!="000000"){
      var chkCode = value.code.substring(0,3);
      if(chkCode === id){
        subject.push({code:value.code, subject:value.subject});
      }
    }
  });
  return subject;
}

function getSchedule(data,chk){
  var myschedule = [];
  var chkBranch;
  if(chk === "room"){ //เช็คว่าค้นหาจากห้องเรียนหรือเวลา ถ้าเท่ากับ room แสดงว่าค้นจากห้องเรียน
    var codeRoom;
    if($("#cboBuilding").val()==="EE"){
      codeRoom="303/305";
    }else if($("#cboBuilding").val()==="EN"){
      codeRoom="000/000";
    }else if($("#cboBuilding").val()==="IE"){
      codeRoom="301/302";
    }else{
      codeRoom="304/307";
    }
    chkBranch = codeRoom.split("/");
  }else{ //ถ้าไม่ใช่แสดงว่าค้นจากเวลา
    chkBranch = $("#cboBranch").val().split("/"); //split ค่าใน cboBranch จาก "/"
  }
  //var chkBranch = $("#cboBranch").val().split("/"); //split ค่าใน cboBranch จาก "/"
  $.each(data, function(key, value) {
    if(value.code!="000000"){ //ถ้า รหัสวิชาไม่เท่ากับ "000000"
      var chkCode = value.code.substring(0,3); //เช็คค่ารหัสวิชา 3 ตัวแรก"
      if((chkCode==chkBranch[0]) || (chkCode==chkBranch[1])){ //ถ้ารหัสวิชา 3 ตัวแรกเท่ากับค่าใน cboBranch
        var res = value.dates;
        var mapObj = {
           SU:"|Sun_",
           MO:"|Mon_",
           TU:"|Tue_",
           WE:"|Wed_",
           TH:"|Thu_",
           FR:"|Fri_",
           SA:"|Sat_"
        };
        res = res.replace(/SU|MO|TU|WE|TH|FR|SA/gi, function(matched){ //แทนค่าที่กำหนดใน array เก็บไว้ใน res
          return mapObj[matched];
        });
        var result = res.split('|');  //split แยกวันที่จาก "|" เช่น |FR_08:00-11:00 EN 507|TU_09:00-12:00 EE 113
        for(var i=0;i<result.length;i++){
          if(result[i]!=""){
            if(result[i].indexOf("EN") == -1){  //หา EN ใน result ถ้าไม่เจอให้ทำ job
              var chkroom = result[i].split('0 '); //split เวลาออกจากห้อง เช่น FR_08:00-11:00 EN 507 => [0]|FR_08:00-11:0, [1]EN 507
              var onroom = chkroom[1];
              var chktime = chkroom[0].split('_'); //split วันออกจากเวลา เช่น FR_08:00-11:00 => [0]|FR, [1]08:00-11:00
              var ondate = chktime[0];
              var intime = chktime[1];
              var ontime = intime.split(':00-'); //split เวลาเริ่มต้นกับสิ้นสุด เช่น 08:00-11:0 => [0]|08, [1]11:0
              var sTime = parseInt(ontime[0]);
              var spTime = ontime[1].split(':'); //split เวลาสิ้นสุด เช่น 11:0 => [0]|ๅๅ, [1]0
              var eTime = "";
              if(spTime[1]=="5"){ //ถ้า spTime เป็นเลข 5
                eTime = parseInt(spTime[0])+1; //ให้ +1 เช่น 08:00-11:50 เวลาผ่านการแปลงทั้งหมดแล้วหลัง : เป็น 5 ต้อง +1 เพิ่อนับเพิ่มให้เป็น 12:00
              }else{
                eTime = parseInt(spTime[0]);
              }
              var spans = eTime-sTime;
              var index;
              if(sTime==8){ index=0;
              }else if(sTime==9){ index=1;
              }else if(sTime==10){ index=2;
              }else if(sTime==11){ index=3;
              }else if(sTime==12){ index=4;
              }else if(sTime==13){ index=5;
              }else if(sTime==14){ index=6;
              }else if(sTime==15){ index=7;
              }else if(sTime==16){ index=8;
              }else if(sTime==17){ index=9;
              }else if(sTime==18){ index=10;
              }else if(sTime==19){ index=11;
              }else {index=12;}
              if((onroom !== "ติดต่อผู้สอน") && (onroom !== "EE 609")){ //ตัดกรณีที่ room เป็น ติอต่อผู้สอน หรือ ห้องที่ไม่ได้ใช้ในการเรียนการสอน
                myschedule.push({code:value.code, date:ondate, start:sTime, end:eTime, room:onroom, span:spans, col:index });
              }
            }
          }
        }
      }
    }
  });

  return myschedule;
}

//function ตัดค่าซ้ำใน json ออก .ห้เหลือแค่ค่าเดียว
function uniqueArr(arr){
  var tempArr = [],
      uniqueRoom = [];
  $.each(arr, function (index, value) {
      if ($.inArray(value.onroom, tempArr) === -1) {
          tempArr.push(value.onroom);
          uniqueRoom.push(value);
      }
  });
  return uniqueRoom;
}

//function diff between two json
function comparer(otherArray){
  return function(current){
    return otherArray.filter(function(other){
      return other.onroom == current.onroom
    }).length == 0;
  }
}

function uniqueSub(arr){
  var tempArr = [],
      uniqueSub = [];
  $.each(arr, function (index, value) {
      if ($.inArray(value.code, tempArr) === -1) {
          tempArr.push(value.code);
          uniqueSub.push(value);
      }
  });
  return uniqueSub;
}

function startDate(before) {
  /* --------------- function find week เพื่อแสดงวันที่ใน table ------------------*/
  var dates = new Date();
  var dateSearch = $('#mydate').val();
  if($.trim(dateSearch) == ''){
    dates = dates;
  }else{
    var res = dateSearch.split("/");
    dates = new Date(res[2], res[1] - 1, res[0]);
  }
  var res = dates.setTime(dates.getTime() + (before * 24 * 60 * 60 * 1000));
  return new Date(res);
}

function getTable(data,dateSearch){
  /* --------------- function create table ------------------*/
  var dates = new Date();
  if(dateSearch == null){ //-----------if mydate is null ---------------
    dates = dates;
  }else{
    var res = dateSearch.split("/");
    dates = new Date(res[2], res[1] - 1, res[0]);
  }
  var DateStr = dates.toString();
  var chkDate = DateStr.substring(0,3);
  var dateString = [{"day":"Sun"},{"day":"Mon"},{"day":"Tue"},
                    {"day":"Wed"},{"day":"Thu"},{"day":"Fri"},{"day":"Sat"}];
  var dateShow = [];
  var before=0;
  for(var i=0;i<7;i++){
    if(chkDate==dateString[i].day){
      before-=i;
    }
  }
  for(var i=0;i<7;i++){
    var numDate = startDate(before);
    before++;
    var month = numDate.getMonth()+1;
    var day = numDate.getDate();
    var year = numDate.getFullYear();
    var datenow = day+"/"+month+"/"+year;
    dateShow.push(datenow);
  }

  var response = [{
    "time":"08:00-09:00"},{"time":"09:00-10:00"},{"time":"10:00-11:00"},{
    "time":"11:00-12:00"},{"time":"12:00-13:00"},{"time":"13:00-14:00"},{
    "time":"14:00-15:00"},{"time":"15:00-16:00"},{"time":"16:00-17:00"},{
    "time":"17:00-18:00"},{"time":"18:00-19:00"},{"time":"19:00-20:00"},{
    "time":"20:00-21:00"
  }];
  var dates = [{
    "in_date":"Sun"},{"in_date":"Mon"},{
    "in_date":"Tue"},{"in_date":"Wed"},{
    "in_date":"Thu"},{"in_date":"Fri"},{
    "in_date":"Sat"
  }];

  var chk=0;
  var table_body ='<table class="table table-bordered" id="example"><thead>';
      table_body +='<tr><th>Date/Time</th>';
      $.each(response, function(key, getTime) {
        table_body +='<th>';
        table_body +=getTime.time;
        table_body +='</th>';
      });
        table_body+='</tr></thead><tbody>';
      var num=0;
      $.each(dates, function(key, getDate) {
        var mydate = $('#mydate').val();
        mydate = mydate.replace(/\b0(?=\d)/g, ''); //trim zero from mydate e.g. 01/10/2018 => 1/10/2018

        if(dateShow[num]==mydate){
          table_body +='<tr align="center" class="bg-light">';
        }else{
          table_body +='<tr align="center">';
        }
        table_body +='<th>';
        table_body +=getDate.in_date+"<br><span style='font-weight:normal;font-size:12px;'>"+dateShow[num]+"</span>";
        table_body +='</th>';
        for(var i=chk;i<13;i++){
          $.each(data, function(key, val) {
            if($("#cboRoom option:selected").text()==val.room){
              if(val.date==getDate.in_date){
                if(i==val.col){
                  chk=val.col+parseInt(val.span);
                  table_body +='<td class="align-middle" colspan="'+val.span+'">';
                  table_body +=val.code;
                  table_body +='</td>';
                  return false;
                }
              }
            }
          });
          if(i>=chk){
            var passDate = dateShow[num].split("/");
            table_body +='<td class="align-middle">';
            if(i==4){
              table_body +='<i class="material-icons">sentiment_dissatisfied</i></a>';
            }else{
              table_body +='<a href="#" data-toggle="modal" data-target="#bookRoom" onClick="test('+i+','+passDate[0]+','+passDate[1]+','+passDate[2]+')">';
              table_body +='<i class="material-icons" title="จองห้อง">sentiment_satisfied</i></a>';
            }
            table_body +='</td>';
          }
        }
        chk=0;
        num++;
        table_body +='</tr>';
      });
      table_body+='</tbody></table>';
      return table_body;
  }

  function test(col,day,month,year){
    var myTime;
    if(col==0){ myTime="08:00";
    }else if(col==1){ myTime="09:00";
    }else if(col==2){ myTime="10:00";
    }else if(col==3){ myTime="11:00";
    }else if(col==4){ myTime="12:00";
    }else if(col==5){ myTime="13:00";
    }else if(col==6){ myTime="14:00";
    }else if(col==7){ myTime="15:00";
    }else if(col==8){ myTime="16:00";
    }else if(col==9){ myTime="17:00";
    }else if(col==10){ myTime="18:00";
    }else if(col==11){ myTime="19:00";
    }else {myTime="20:00";}
    $("#ondate").val(day+"/"+month+"/"+year);
    $("#startTime").val(myTime);

    for(var i=(col+9);i<22;i++){ //loop เวลาใน endTime
      if(i<10){
        $('#endTime')
        .append($("<option></option>")
          .attr("value","0"+i+":00")
          .text("0"+i+":00"));
      }else{
        $('#endTime')
        .append($("<option></option>")
          .attr("value",i+":00")
          .text(i+":00"));
      }
    }
  }
