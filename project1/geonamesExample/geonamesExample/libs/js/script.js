$(document).ready(function() {

    // Common function to fetch country info
    function fetchCountryInfo(apiId, country, language) {
        let infoType = "";

        // Determine the infoType based on the apiId
        switch (apiId) {
            case "api1":
                infoType = "type1"; // Modify with actual type or additional parameters as needed
                break;
            case "api2":
                infoType = "type2"; 
                break;
            case "api3":
                infoType = "type3";
                break;
            default:
                console.error('Invalid API ID');
                return;
        }

        $.ajax({
            url: "libs/php/getCountryInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: country,
                lang: language,
                infoType: infoType
            },
            success: function(result) {
                // Display the results in the apiResults div
                $('#apiResults').html(JSON.stringify(result));
            },
            error: function(error) {
                console.error('API call failed:', error);
            }
        });
    }

    // Action for API Submit buttons
    $('button[data-api-id]').click(function() {
        let apiId = $(this).attr('data-api-id');
        const selectedCountry = $('#selCountry').val();
        const selectedLanguage = $('#selLanguage').val();
        fetchCountryInfo(apiId, selectedCountry, selectedLanguage);
    });
});
