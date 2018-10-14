function getSchedule(data){
  var myschedule = [];
  var chkBranch = $("#cboBranch").val().split("/"); //split ค่าใน cboBranch จาก "/"
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
              if((onroom !== "ติดต่อผู้สอน") && (onroom !== "EE 609")){ //ตัดกรณีที่ room เป็น ติอต่อผู้สอน หรือ ห้องที่ไม่ได้ใช้ในการเรียนการสอน
                myschedule.push({code:value.code, date:ondate, start:sTime, end:eTime, room:onroom, spans:spans });
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
