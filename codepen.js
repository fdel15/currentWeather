var apikey = "17f731f3aca3f3eed800e04c5fbf7a4c";
var d1 = $.Deferred();
var d2 = $.Deferred();
var long, lat, location, temp, wind, desc, icon;

$(document).ready(initialize)

function initialize() {
  geolocation();
  $.when(d1).done(getLocalWeather);
  $.when(d2).done(function(){
    setIcon();
    setTemp("F");
    setLocation();
    setDescription();
    setWind();
  });
}

// ************
// get data
// ************

function geolocation() {
  navigator.geolocation.getCurrentPosition(function(pos){
    getLatitude(pos);
    getLongitude(pos);
    d1.resolve();
  });
}

function getLatitude(pos) {
  lat = pos.coords.latitude;
}

function getLongitude(pos) {
  long = pos.coords.longitude;
}

function getLocalWeather() {
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&APPID="+apikey, function(data){
    name = data.name;
    temp = kelvinToFahrenheit(data.main.temp);
    wind = windMPH(data.wind.speed);
    desc = data.weather[0].description;
    icon = getIconURL(data.weather[0].icon);
    d2.resolve();
  });
}

function getIconURL(img) {
  return "http://openweathermap.org/img/w/" + img +".png";
}

// ************
// set display
// ************

function setIcon() {
  $("#img").attr("src", icon)
}

function setTemp(sym) {
  $("#temp").text(temp + "\xB0" + sym)
}

function setLocation() {
  $("#location").text(name)
}

function setDescription() {
  $("#description").text(desc)
}

function setWind() {
  $("#wind").text("Wind: " + wind + "mph")
}
// ************
// calculations
// ************

function kelvinToFahrenheit(temp) {
  return Math.round(temp * (9/5) - 459.67);
}

function fahrenheitToCelsius(temp) {
  return Math.round((temp - 32) * (5/9));
}

function celsiusToFahrenheit(temp) {
  return Math.round((temp * (9/5)) + 32);
}

function windMPH(speed) {
  return Math.round(speed * 2.23694);
}
