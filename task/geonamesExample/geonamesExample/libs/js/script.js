let countryInfo = null;

$(document).ready(function() {
    $('#btnRun').click(function() {
        const country = $('#selCountry').val();
        const language = $('#selLanguage').val();
        
       
        makeAPICall('getCountryInfo', { country, lang: language }, function(result) {
            // latitude and longitude to the response data
            result.data[0].latitude = parseFloat(result.data[0].north) + parseFloat(result.data[0].south) / 2;
            result.data[0].longitude = parseFloat(result.data[0].east) + parseFloat(result.data[0].west) / 2;
    
            countryInfo = result;
            console.log("Initial Country Info:", countryInfo);
            // Optionally, you can display the result here or anywhere you need
            $('#apiResults').html(JSON.stringify(result.data));
        });
    });
    

    $('button[data-api-id="api1"]').click(function() {
        if (countryInfo) {
            $('#apiResults').html(JSON.stringify(countryInfo.data));
        }
    });

    

    $('button[data-api-id="api2"]').click(function() {
        if (countryInfo) {
            const country = $('#selCountry').val(); 
    
            const params = {
                country: country, 
                username: 'AlerdoBallabani' 
            };
    
            console.log("Nearby Countries Params:", params); 
    
            makeAPICall('getNearbyCountries', params);
        }
    });
    
    

    $('button[data-api-id="api3"]').click(function() {
        if (countryInfo) {
            const params = {
                north: countryInfo.data[0].north,
                south: countryInfo.data[0].south,
                east: countryInfo.data[0].east,
                west: countryInfo.data[0].west,
                lang: $('#selLanguage').val()
            };
    
           
            console.log("Cities Info Params:", params); // Debugging statement
    
            makeAPICall('getCitiesInfo', params);
        }
    });

    $('button[data-api-id="api4"]').click(function(result) {
        if (countryInfo) {
            const params = {
                continent: countryInfo.data[0].continent,
                lang: $('#selLanguage').val()
            };
            
            console.log("Continent Info Params:", params);
    
            makeAPICall('getContinentInfo', params);
            console.log(result)
        }
    });
    

    function makeAPICall(action, params, callback = null) {
        params.action = action;
        $.ajax({
            url: "libs/php/getCountryInfo.php",
            type: 'POST',
            dataType: 'json',
            data: params,
            success: function(result) {
                if(callback) {
                    callback(result);
                } else {
                    $('#apiResults').html(JSON.stringify(result.data));
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('API call failed:', textStatus, errorThrown);
            }
        });
    }
});
