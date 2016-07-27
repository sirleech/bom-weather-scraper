var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


url = 'http://m.bom.gov.au/act/canberra/';

request(url, function(error, response, html){
  if(!error){
    var $ = cheerio.load(html);

    var current_temp_c, apparent_temp_c, wind, wind_array, wind_speed_kmh, wind_cardinal_direction;
    var json = { current_temp_c : "", apparent_temp_c : "", wind_speed_kmh : "", wind_cardinal_direction : ""};

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

  }

  fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    console.log('File successfully written! - Check your project directory for the output.json file');
  })

})

