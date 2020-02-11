$( document ).ready(function() {
        $( "#searchCityForm" ).submit(function( event ) {
            var cityName= $( "#cityInputField" ).val(); 
            if (cityName) {

                var newCityButton = $( "<button>" ).addClass( "btn btn-outline-info cityPresetBtn" ).attr( "id", cityName).html(cityName);
                
                $("#cityPresetBtnsDiv").append( newCityButton );

                $("#cityPresetBtnsDiv").append( "<br />" );

                $("#cityInputField").val("");

                event.preventDefault();
            }

            $(".cityPresetBtn").click(function(event) {
                    var city = $(this).attr("id");
                    
                getTodaysWeatherForCity(city);

                event.preventDefault();
              });


        });


});

function getTodaysWeatherForCity(city) {
    var apiKey = "b15d3dd7cb4e7a19ba28ad3a88e86991";
    var cityWeatherData = {};
    $.ajax({
        method: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?q='+city+',us&appid='+apiKey,
        dataType: 'jsonp',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        success: function(result) {
                cityWeatherData = {
                    thisCity: result.name,
                    longitude: result.coord.lon,
                    latitude: result.coord.lat,
                    temperature: result.main.temp,
                    humidity: result.main.humidity,
                    windSpeed: result.wind.speed,                    
                }
        },
        error: function(error) {
            throw(error);
        },
        complete: function() { 
            
            getForecastForCity(city, apiKey, cityWeatherData);
            getUvIndexForCity(apiKey,cityWeatherData);
         
        }
    });

};

function getForecastForCity(city, apiKey, cityWeatherData) {
        
        $.ajax({
        method: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/forecast?q='+city+',us&appid='+apiKey,
        dataType: 'jsonp',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        success: function(result) {
                cityWeatherData.fiveDayForecast = {
                    dayOne: {
                        date: result.list[4].dt_txt,
                        weather: result.list[4].weather[0].main,
                        temperature: result.list[4].main.temp,
                        humidity: result.list[4].main.humidity,
                    },
                    dayTwo: {
                        date: result.list[12].dt_txt,
                        weather: result.list[12].weather[0].main,
                        temperature: result.list[12].main.temp,
                        humidity: result.list[12].main.humidity,
                    },
                    dayThree: {
                        date: result.list[20].dt_txt,
                        weather: result.list[20].weather[0].main,
                        temperature: result.list[20].main.temp,
                        humidity: result.list[20].main.humidity,
                    },
                    dayFour: {
                        date: result.list[28].dt_txt,
                        weather: result.list[28].weather[0].main,
                        temperature: result.list[28].main.temp,
                        humidity: result.list[28].main.humidity,
                    },
                    dayFive: {
                        date: result.list[36].dt_txt,
                        weather: result.list[36].weather[0].main,
                        temperature: result.list[36].main.temp,
                        humidity: result.list[36].main.humidity,
                    },
                };
        },        
        error: function(error) {
            throw(error);
        },
        complete: function() { 
           console.log(cityWeatherData);
            renderForecast(cityWeatherData);
            
        }   
        
    });

}


function getUvIndexForCity(apiKey, cityWeatherData) {
    var cityLon = (cityWeatherData.longitude);
    var cityLat = (cityWeatherData.latitude);
    $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/uvi?appid='+apiKey+'&lat='+cityLat+'&lon='+cityLon,

    success: function(result) {
            cityWeatherData.UvIndex = {
                    cityUv: result.value,
            };
    },        
    error: function(error) {
        throw(error);
    },
    complete: function() { 
                    
        renderForecast(cityWeatherData);
        
    }   
    
});

}



function renderForecast(cityWeatherData) {
    //var kCityTemp = (cityWeatherData.temperature);
    //var fCityTemp = {$(kCityTemp) − 273.15) × 9/5 + 32 = -459.7°F)};
    
    //Current Weather
    $("#forecastWindow").show();
    $("#selectedCityInfo").html(cityWeatherData.thisCity);
    $("#todayTemp").html('Temperature: ' + cityWeatherData.temperature + '°F');
    $("#todayHumidity").html('Humidity: ' + cityWeatherData.humidity + '%');
    $("#todayWind").html('Wind Speed: ' + cityWeatherData.windSpeed + 'mph');
    $("#todayUv").html('UV Index: ' + cityWeatherData.UvIndex.cityUv);
    
    //Five day forecast
    //Day One
    $("#dayOneDate").html(cityWeatherData.fiveDayForecast.dayOne.date);
    $("#dayOneWeather").html(cityWeatherData.fiveDayForecast.dayOne.weather);
    $("#dayOneTemperature").html('Temperature: ' + cityWeatherData.fiveDayForecast.dayOne.temperature + '°F');
    $("#dayOneHumidity").html('Humidity: ' + cityWeatherData.fiveDayForecast.dayOne.humidity + '%');

    //Day Two
    $("#dayTwoDate").html(cityWeatherData.fiveDayForecast.dayTwo.date);
    $("#dayTwoWeather").html(cityWeatherData.fiveDayForecast.dayTwo.weather);
    $("#dayTwoTemperature").html('Temperature: ' + cityWeatherData.fiveDayForecast.dayTwo.temperature + '°F');
    $("#dayTwoHumidity").html('Humidity: ' + cityWeatherData.fiveDayForecast.dayTwo.humidity + '%');

    //Day Three
    $("#dayThreeDate").html(cityWeatherData.fiveDayForecast.dayThree.date);
    $("#dayThreeWeather").html(cityWeatherData.fiveDayForecast.dayThree.weather);
    $("#dayThreeTemperature").html('Temperature: ' + cityWeatherData.fiveDayForecast.dayThree.temperature + '°F');
    $("#dayThreeHumidity").html('Humidity: ' + cityWeatherData.fiveDayForecast.dayThree.humidity + '%');

    //Day Four
    $("#dayFourDate").html(cityWeatherData.fiveDayForecast.dayFour.date);
    $("#dayFourWeather").html(cityWeatherData.fiveDayForecast.dayFour.weather);
    $("#dayFourTemperature").html('Temperature: ' + cityWeatherData.fiveDayForecast.dayFour.temperature + '°F');
    $("#dayFourHumidity").html('Humidity: ' + cityWeatherData.fiveDayForecast.dayFour.humidity + '%');

    //Day Five
    $("#dayFiveDate").html(cityWeatherData.fiveDayForecast.dayFive.date);
    $("#dayFiveWeather").html(cityWeatherData.fiveDayForecast.dayFive.weather);
    $("#dayFiveTemperature").html('Temperature: ' + cityWeatherData.fiveDayForecast.dayFive.temperature + '°F');
    $("#dayFiveHumidity").html('Humidity: ' + cityWeatherData.fiveDayForecast.dayFive.humidity + '%');
    
}

/*
$("#").html(cityWeatherData.fiveDayForecast.[i].date);
    $("#").html(cityWeatherData.fiveDayForecast.[i].weather);
    $("#").html(cityWeatherData.fiveDayForecast.[i].temperature);
    $("#").html(cityWeatherData.fiveDayForecast.[i].humidity);
}
*/

/*
var keys = fiveDayForecast;
    for (var i = 0;  i < keys.length; i++) {
    $("#").html(keys[i].date);
    $("#").html([i].weather);
    $("#").html([i].temperature);
    $("#").html([i].humidity);
    };
}
*/