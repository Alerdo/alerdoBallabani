let countryInfo = null;

$(document).ready(function() {

    $('#btnRun').click(function() {
        const country = $('#selCountry').val();
        const language = $('#selLanguage').val();
        
        // Make the initial API call on "Run" button click
        makeAPICall('getCountryInfo', { country, lang: language }, function(result) {
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
            const params = {
                lat: countryInfo.data[0].latitude,
                lng: countryInfo.data[0].longitude
            };
            makeAPICall('getWeatherInfo', params);
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
            makeAPICall('getCitiesInfo', params);
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
