var apikey = "17f731f3aca3f3eed800e04c5fbf7a4c";
var d1 = $.Deferred();
var d2 = $.Deferred();
var long, lat, location, temp, wind, desc, icon, cels, fahr;

$(document).ready(initialize)

function initialize() {
  geolocation();
  $.when(d1).done(getLocalWeather);
  $.when(d2).done(function(){
    setIcon();
    setTemp(fahr, "F");
    setLocation();
    setDescription();
    setWind();
    setBackground(fahr);
    addConvertButton();
  });
  $(document).on("click", "a.f", getCelsius)
  $(document).on("click", "a.c", getFahrenheit)
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
    fahr = kelvinToFahrenheit(data.main.temp);
    cels = kelvinToCelsius(data.main.temp);
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

function setTemp(temp, sym) {
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

function setBackground(temp) {
  var season;
    if(temp < 40) {
      season = "winter";
    } else if(temp >= 40 && temp < 60) {
      season = "fall"
    } else if(temp >= 60 && temp < 80){
      season = "spring"
    } else {
      season = "summer"
    }
  $('body').removeClass().addClass(season)
}

function addConvertButton() {
  $('#tempNicon').append("<a class='convert f' href='#'>Get C&deg</a>")
}

function getCelsius() {
  $(this).removeClass('f').addClass('c')
  $(this).text("Get F\xB0")
  $(this).css('text-decoration', 'none')
  $(this).css('color', 'black')
  setTemp(cels, "C")
}

function getFahrenheit() {
  $(this).removeClass('c').addClass('f')
  $(this).text("Get C\xB0")
  $(this).css('color', 'black')
  setTemp(fahr, "F")
}


// ************
// calculations
// ************

function kelvinToFahrenheit(temp) {
  fahr = Math.round(temp * (9/5) - 459.67);
  return fahr;
}

function kelvinToCelsius(temp) {
  cels = Math.round(temp - 273);
  return cels;
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
