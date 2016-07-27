var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');


url = 'http://m.bom.gov.au/act/canberra/';

request(url, function(error, response, html){
  if(!error){
    var $ = cheerio.load(html);

    var current_temp_c, apparent_temp_c, wind, wind_array, wind_speed_kmh, wind_cardinal_direction, time;
    var json = { current_temp_c : "", apparent_temp_c : "", wind_speed_kmh : "", wind_cardinal_direction : "", time : ""};

    $('.current-temp').filter(function(){
      var data = $(this);
      current_temp_c = data.text().trim();
      current_temp_c = current_temp_c.substring(0, current_temp_c.length - 1);
      json.current_temp_c = current_temp_c;
    })
    
    $('.feels-like').filter(function(){
      var data = $(this);
      apparent_temp_c = data.children().last().text().trim();
      apparent_temp_c = apparent_temp_c.substring(0, apparent_temp_c.length - 2);
      json.apparent_temp_c = apparent_temp_c;
    })

    $('.wind-spd').filter(function(){
      var data = $(this);
      wind = data.text();
      wind_array = wind.split(" ");
      json.wind_speed_kmh = wind_array[1];
      json.wind_cardinal_direction = wind_array[0];
    })
    

    json.time = timeStamp();


  }

  fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    console.log('File successfully written! - Check your project directory for the output.json file');
  })

})

/**
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 */

function timeStamp() {
// Create a date object with the current time
  var now = new Date();

// Create an array with the current month, day and time
  var date = [ now.getDate(), now.getMonth() + 1, now.getFullYear() ];

// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12
  time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

// Return the formatted string
  return date.join("/") + " " + time.join(":") + " " + suffix;
}

