<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>

    <!-- jQuery Datepicker -->
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/smoothness/jquery-ui.css" rel="stylesheet"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link href="https://fonts.googleapis.com/css?family=Mali" rel="stylesheet">

    <!-- myscript -->
    <script src="public/js/script.js"></script>

    <title>ระบบจองห้องเรียนออนไลน์</title>
    <style>
      body{
        font-family: 'Mali', cursive;
      }
    </style>
  </head>
  <body>
    <div class="container-fluid">
      <nav class="navbar navbar-light bg-light">
        <a class="navbar-brand" href="#">
          <i class="material-icons">computer</i>
          ระบบจองห้องเรียนออนไลน์
        </a>
      </nav>
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">ค้นหาข้อมูลจากห้องเรียน</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">ค้นหาข้อมูลตามช่วงเวลา</a>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
          <div class="row">
            <div class="col-sm">
              <div class="card">
                <div class="card-header">Room</div>
                <div class="card-body">
                  <form>
                    <div class="form-row">
                      <div class="form-group col-md-2">
                        <label for="cboBuilding">อาคารเรียน</label>
                        <select id="cboBuilding" class="form-control">
                          <option selected>Choose...</option>
                          <option value="EE">EE</option>
                          <option value="EN">EN</option>
                          <option value="CE">CE</option>
                          <option value="IE">IE</option>
                        </select>
                      </div>
                      <div class="form-group col-md-2">
                        <label for="cboRoom">ห้องเรียน</label>
                        <select id="cboRoom" class="form-control">
                          <option selected>Choose...</option>
                        </select>
                      </div>
                      <div class="form-group col-md-2">
                        <label for="mydate">วันที่</label>
                        <input class="form-control" id="mydate">
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <div class="card">
                <div class="card-header">ตารางการใช้ห้องเรียน</div>
                <div class="card-body">
                  <div id="tableDiv">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
          <div class="row">
            <div class="col-sm">
              <div class="card">
                <div class="card-header">Time</div>
                <div class="card-body">
                  <form>
                    <div class="form-row">
                      <div class="form-group col-md-2">
                        <label for="indate">วันที่</label>
                        <input class="form-control" id="indate">
                      </div>
                      <div class="form-group col-md-2">
                        <label for="cboBranch">อาคารเรียน</label>
                        <select id="cboBranch" class="form-control">
                          <option selected>Choose...</option>
                          <option value="303/305">EE</option>
                          <option value="000/000">EN</option>
                          <option value="301/302">IE</option>
                          <option value="304/307">CE</option>
                        </select>
                      </div>
                      <div class="form-group col-md-1">
                        <label for="cboStartTime">เวลาเริ่มต้น</label>
                        <select id="cboStartTime" class="form-control">
                          <option selected>Choose...</option>
                        </select>
                      </div>
                      <div class="form-group col-md-1">
                        <label for="cboEndTime">เวลาสิ้นสุด</label>
                        <select id="cboEndTime" class="form-control">
                          <option selected>Choose...</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <div class="card">
                <div class="card-header">ตารางการใช้ห้องเรียน</div>
                <div class="card-body">
                  <div id="tableTime">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      $(document).ready(function(){
         $("#mydate").datepicker({
           changeYear: true,
           changeMonth: true,
           dateFormat: "dd/m/yy",
           yearRange: "-100:+20",
         });
         $("#indate").datepicker({
           changeYear: true,
           changeMonth: true,
           dateFormat: "dd/m/yy",
           yearRange: "-100:+20",
         });
         for(var i=8;i<21;i++){ //loop เวลาใน cboStartTime
           if(i<10){
             $('#cboStartTime')
             .append($("<option></option>")
               .attr("value","0"+i+":00")
               .text("0"+i+":00"));
           }else{
             $('#cboStartTime')
             .append($("<option></option>")
               .attr("value",i+":00")
               .text(i+":00"));
           }
         }
      });

      $( "#cboStartTime" ).change(function() {
        /* --------------- เมื่อเลือกเวลาใน cboStartTime ให้ loop เวลาใน cboEndTime ------------------*/
        var startTime = $('#cboStartTime').val(); //เช็คเวลาใน cboStartTime
        startTime = startTime.split(':');
        var myTime = parseInt(startTime[0])+1;
        $("#cboEndTime option").remove();
        $("#cboEndTime").append('<option selected>Choose...</option>');
        for(var j=myTime;j<22;j++){
          if(j<10){
            $('#cboEndTime')
            .append($("<option></option>")
              .attr("value","0"+j+":00")
              .text("0"+j+":00"));
          }else{
            $('#cboEndTime')
            .append($("<option></option>")
              .attr("value",j+":00")
              .text(j+":00"));
          }
        }
      });

      $( "#cboEndTime" ).change(function() {
        /* --------------- เมื่อ cboEndTime มีการเปลี่ยนแปลง ------------------*/
        if(($("#indate").val()=="") || ($("#cboBranch").val()=="Choose...")){ //เช็คค่าใน indate กับ cboBranch ว่ามีการค่าแล้วหรือยัง
          alert("กรุณาใส่วันที่และเลือกสาขาวิชาก่อนด้วยค่ะ");
          $("#cboEndTime").val("Choose..."); //หากยังไม่มีการกำหนดค่าใน indate และ cboBranch ให้ cboEndTime selected ที่ Choose...
        }else{
          $.getJSON( "http://localhost:3000/room", function( data ) { //get json data จาก /room
            var myschedule = getSchedule(data,"time");
            //console.log(myschedule);
            var stime = $("#cboStartTime").val().split(":");
            stime = parseInt(stime[0]);
            var etime = $("#cboEndTime").val().split(":");
            etime = parseInt(etime[0]);
            var isroom=[];
            var onroom=[];
            $.each(myschedule, function(key, value) {
              var date = $("#indate").val().split("/");
              date = new Date(date[2], date[1] - 1, date[0]);
              date = date.toString().substring(0,3); //ตัดเอาเฉพาะ 3 ตัวอักษรแรกใน date เช่น Thu
              if(date == value.date){
                for(var i=value.start;i<=value.end;i++){ //เช็คตั้งแต่เวลาเริ่มต้น ถึงสิ้นสุดใน reg เช่น start 9 end 11
                  if((i>=stime) && (i<etime)){ //ถ้าเวลาเริ่มต้นใน reg มากกว่าหรือเท่ากับเวลาเริ่มต้นของเวลาที่ต้องการจองห้อง และน้อยกว่าเวลาสิ้นสุดในการจองห้อง เช่น เวลาที่ต้องการจองคือ 8:00-10:00
                    onroom.push({onroom:value.room}); //ให้ push ห้องลงใน onroom หมายถึงห้องที่มีการเรียนการสอนใน reg
                    break; //เมื่อพบแล้วออกจาก loop เลยไม่ต้องค้นหาต่อ
                  }else{
                    isroom.push({onroom:value.room}); //กรณีที่ไม่พบ ให้ push ลง isroom คือห้องที่ไม่มีการเรียนการสอนใน reg
                    break;
                  }
                }
              }
            });
            var a = uniqueArr(onroom); //ตัดค่าซ้ำในห้องที่มีการเรียนการสอน เช่น [{onroom:"EE 113"}, {onroom:"EE 113"}] => [{onroom:"EE 113"}]
            var b = uniqueArr(isroom); //ตัดค่าซ้ำห้องที่ไม่มีการเรียนการสอน
            var onlyInB = b.filter(comparer(a)); //ตัดห้องที่มีการเรียนการสอนออกจากห้องที่ไม่มีการเรียนการสอน เช่น a มี [{onroom:"EE 113"}, {onroom:"EE 106"}], b มี [{onroom:"EE 113"}, {onroom:"EE 606"}] จะได้ [{onroom:"EE 606"}]
            $.getJSON( "http://localhost:3000/building/"+$("#cboBranch option:selected").text(), function( res ) {
              var onlyInC=[];
              $.each(res, function(key, value) { //หาห้องที่มีทั้งหมด
                var result = value.title.split('ความจุ : '); //เช็คความจุ
                var text = value.title.split(' ประเภท'); //ตัดเอาชื่อห้อง
                if(result[1].substring(0,1) != 0){ //ถ้าความจุไม่ทเ่ากับศูนย์
                  onlyInC.push({onroom:text[0]}); //ให้เก็บเลขห้องลงใน onlyInC
                }
              });
            var onlyInA = onlyInC.filter(comparer(a)); //ค้นเลขห้องทั้งหมดว่าซ้ำกับห้องที่มีการใช้งานแล้วไหม ถ้าเจอให้ตัดห้องที่มีการใช้งานออก
            onlyInA = onlyInA.filter(comparer(b)); //เมื่อตัดห้องที่มีการใช้งานออกแล้วเช็คว่ามีห้องซ้ำกับห้องใน b ไหม
            var result = onlyInA.concat(onlyInB); //นำห้องใน onlyInA มาต่อกับ ห้องใน onlyInB
            var table_body ='<table class="table table-bordered" id="example"><tbody>';
                table_body +='<tr><th>Room</th>';
                  $.each(result, function(key, val) {
                      table_body +='<td>'+val.onroom+'</td>';
                  });
                table_body +='</tr></tbody></table>';
                $('#tableTime').html(table_body);
            });
          });
        }
      });

      $( "#cboBuilding" ).change(function() {
        /* --------------- เมื่อมีการเลือกอาคารเรียน ให้ loop แสดงห้องทั้งหมดในอาคาร ------------------*/
        $("#cboRoom option").remove();
        $("#cboRoom").append('<option selected>Choose...</option>');
        $.getJSON( "http://localhost:3000/building/"+$("#cboBuilding").val(), function( data ) {
          if($("#cboBuilding").val() === "EE"){ //ถ้า cboBuilding เท่ากับ EE ให้เพิ่มห้อง EE 315
            $('#cboRoom')
            .append($("<option></option>")
              .attr("value","0000")
              .text("EE 315"));
          }
          $.each(data, function(key, value) {
            var result = value.title.split('ความจุ : ');
            var text = value.title.split(' ประเภท');
            if(result[1].substring(0,1) != 0){
              $('#cboRoom')
              .append($("<option></option>")
                .attr("value",value.room_id)
                .text(text[0]));
            }
          });
        });
      });

      $( "#mydate" ).change(function(){
        /* --------------- เมื่อเลือกวันที่ในการค้นหาแบบห้องเรียน ------------------*/
        if($("#cboBuilding").val()=="Choose..."){
          alert("กรุณาเลือกอาคารเรียนและห้องเรียนก่อนด้วยค่ะ");
        }else{
          $.getJSON( "http://localhost:3000/room", function( data ) {
            var myschedule = getSchedule(data,"room");
            myschedule.sort(function(a,b){  //เรียงเวลาใน json ใหม่จากน้อยไปมาก
               if(a.start > b.start){ return 1}
                if(a.start < b.start){ return -1}
                  return 0;
            });
            var myTable = getTable(myschedule,$( "#mydate" ).val());
            $('#tableDiv').html(myTable);
          });
        }
      });

      $( "#cboRoom" ).change(function() {
        /* --------------- เมื่อ cboRoom มีการเปลี่ยนแปลงจากการค้นหาแบบห้องเรียน ------------------*/
        if($("#mydate").val()!=""){
          $.getJSON( "http://localhost:3000/room", function( data ) {
            var myschedule = getSchedule(data,"room");
            myschedule.sort(function(a,b){  //เรียงเวลาใน json ใหม่จากน้อยไปมาก
               if(a.start > b.start){ return 1}
                if(a.start < b.start){ return -1}
                  return 0;
            });
            var myTable = getTable(myschedule,$( "#mydate" ).val());
            $('#tableDiv').html(myTable);
          });
        }else{
          $.getJSON( "http://localhost:3000/room", function( data ) {
            var myschedule = getSchedule(data,"room");
            myschedule.sort(function(a,b){  //เรียงเวลาใน json ใหม่จากน้อยไปมาก
               if(a.start > b.start){ return 1}
                if(a.start < b.start){ return -1}
                  return 0;
            });
            var myTable = getTable(myschedule,null);
            $('#tableDiv').html(myTable);
          });
        }
      });
    </script>
  </body>
</html>
