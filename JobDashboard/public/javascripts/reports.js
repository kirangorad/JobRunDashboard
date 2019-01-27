//Calling services to get the data
$(document).ready(function(){
  $('#error_no_jobs').hide();
  $.ajax({
    url: "http://localhost:3000/job_runs/dateminmax", 
    success: function(result){

      result.forEach(function(record) {        
        console.log(record);
      });
     
    }
  });

  $.ajax({
    url: "http://localhost:3000/job_runs/jobnames", 
    success: function(result){

      result.forEach(function(record) {        
        $('#jobDropDown').append('<a class="dropdown-item" href="#">' + record.job_name + '</a>');
        $(".dropdown-menu a").click(function(){
          $(this).parents(".dropdown").find('.btn').html($(this).text());
          $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
        });
      });
     
    }
  });


//All records
  $.ajax({
    url: "http://localhost:3000/job_runs", 
    success: function(result){

      var labels = [];
      var data = [];
      var jobNames = [];
      console.log(result.length);
      if(result.length > 0) {
        $('#error_no_jobs').hide();
        result.forEach(function(record) {        
          data.push(record.mins);
          labels.push(getDataTime(record.start_ts).date);
        });  
      }
      else {
        $('#error_no_jobs').show();
      }
      
        
      plotDailyTimeTakenGraph(labels, data, '');
    }
  });

});



$('#getDataButton').click(function(){

  var filterData = {
    'startDate' : $('#fromdate').val(),
    'endDate' : $('#todate').val(),
    'jobName' : $('#dropdownMenuButton').text().toString().replace(/\n/g, '').replace(/\t/g, '') //replacing junk chars
  };

  if(filterData.startDate == '' || filterData.endDate == '' || filterData.jobName == 'Select Job') {
    $('#error_no_jobs').show();
  }
  else {

    $.ajax({
      url: "http://localhost:3000/job_runs", 
      type: 'post',
      data: filterData,
      success: function(result){

        var labels = [];
        var data = [];
        var jobNames = [];
        if(result.length > 0) {
          $('#error_no_jobs').hide();
          result.forEach(function(record) {        
            data.push(record.mins);
            labels.push(getDataTime(record.start_ts).date);
          });
        }
        else {
          $('#error_no_jobs').show();        
        }  
        plotDailyTimeTakenGraph(labels, data, filterData.jobName);
      }
    });
  }


});



function plotDailyTimeTakenGraph(labels, data, jobName) {

 

  new Chart(document.getElementById("lc-daily-time-taken"), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{ 
          data: data,
          label: "Time Taken",
          borderColor: "#3e95cd",
          fill: false
        }, 
        // { 
        //   data: [10,12,8,23],
        //   label: "Add Label",
        //   borderColor: "#8e5ea2",
        //   fill: false
        // }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Time taken for job ' + jobName
      },
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
    }
  });

}


///////////////////////////////////

////////////Supporting function

function getDataTime(timestamp_string) {
  var timeDetails = timestamp_string.split('_');
  var date = timeDetails[0].substr(0,4) + '-' + timeDetails[0].substr(4,2) + '-' + timeDetails[0].substr(6,2);
  //new Date(parseInt(timeDetails[0].substr(0,4)), parseInt(timeDetails[0].substr(4,2)) - 1, parseInt(timeDetails[0].substr(6,2)));
  var time = timeDetails[1].substr(0,2) + ':' + timeDetails[1].substr(2,2) + ':' + timeDetails[1].substr(4,2);
  var day = timeDetails[2];
  var parsedDateTime = {
    'date' : date,
    'time' : time,
    'day' : day
  };

  return parsedDateTime;
}


/*
new Chart(document.getElementById("line-chart"), {
  type: 'line',
  data: {
    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
    datasets: [{ 
        data: [86,114,106,106,107,111,133,221,783,2478],
        label: "Africa",
        borderColor: "#3e95cd",
        fill: false
      }, { 
        data: [282,350,411,502,635,809,947,1402,3700,5267],
        label: "Asia",
        borderColor: "#8e5ea2",
        fill: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Time taken for job run'
    }
  }
});
*/