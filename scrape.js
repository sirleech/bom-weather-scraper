var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


url = 'http://m.bom.gov.au/act/canberra/';

request(url, function(error, response, html){
  if(!error){
    var $ = cheerio.load(html);

    var feels_like, wind;
    var json = { feels_like : "", wind : ""};

    $('.feels-like').filter(function(){
      var data = $(this);
      feels_like = data.children().last().text().trim();
      json.feels_like = feels_like;
    })

    $('.wind-spd').filter(function(){
      var data = $(this);
      wind = data.text();
      json.wind = wind;
  })

  }

  fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    console.log('File successfully written! - Check your project directory for the output.json file');
  })

})

