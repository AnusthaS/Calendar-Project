
//dependencies 
var express = require('express')
var fs = require('fs')
var app = express()
var path = require('path');
var request = require('request');
require('dotenv').config();

//get static files from public directory
app.use(express.static('public'));

//EJS
app.set('view engine', 'ejs');

// Get data from Bizzabo API;
const url = "https://api.bizzabo.com/api/events";
const options = {
    url: url,
    headers: {
        "accept": "application/vnd.bizzabo.v2.0+json",
        "authorization": process.env.API_KEY
    }
  };
 
//Massaging data for FullCalendar.io
app.get('/full', function(req, res){
  request(options, function (error, response, body) {
    if (!error ) {
      // from within the callback, write data to response, essentially returning it.
    var bizz= JSON.parse(body);
    var events = [];
    console.log(bizz);
    for (var event of bizz.content){
         //console.log(event);
        events.push({
            start: event.startDate,
            end: event.endDate,
            title: event.name,
            url: event.websiteUrl
        })
    } 
    res.render(path.join(__dirname + '/views/full.ejs'), { bizzfull : events });
    }
  })

});
 
 //Massaging data for EvoCalendar
 app.get('/evo', function(req, res){
    request(options, function (error, response, body) {
      if (!error) {
        // from within the callback, write data to response, essentially returning it.
      var bizz2= JSON.parse(body);
      
      var events2 = [];
      for (var evnt of bizz2.content){
        console.log(evnt);
          events2.push({
              id: evnt.id,
              name: evnt.name,
              date: [evnt.startDate, evnt.endDate],
              type: evnt.type,
              url:  evnt.websiteUrl
          })
      } 
      res.render(path.join(__dirname + '/views/evo.ejs'), { bizzevo : events2 });
      }
    })
  }); 
               
//Server
const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });
