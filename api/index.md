---
layout: msm/msm-results
permalink: /sandbox/api/
---
<h1>API test page</h1>
<!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>-->
<script>
var creds = 'p6XqHIFHGGQqABCUL7FCr9BnMJ25VX66';
//var creds = 'qqyTtuX3bjn9clJEMNQSPvG19ZHjW5bR';
var ajax = function(method,url,data,callback) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);
    request.setRequestHeader("client_id", creds);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var response = JSON.parse(request.responseText);
            callback(response);
        }
    }
    if (data) {
        request.send(JSON.stringify(data));
    } else {
        request.send();
    }
};

var logResponse = function(obj){
    console.log(obj);
};

//ajax('https://moneysupermarket-staging.apigee.net/gb/reference-data/v0/vehicles?registrationNumber=LWR82H',logResponse);
var creditCardsData = {
   "offset": 0,
   "limit": 11,
   "sort": [
       {
           "name": "code",
           "order": "asc"
       }
   ],
   "filters": [
       {
           "name": "category.name",
           "values": ["cat_msm_credit_card_goal_06"],
           "filterType": "ALL"
       }
   ]
};

// Credit cards
//var cardsHref = 'https://moneysupermarket-dev.apigee.net/gb/product/v1/search/listing-products?facets=true';
//ajax('POST',href,creditCardsData,logResponse);

// Vehicle lookup
var regHref = 'https://moneysupermarket-dev.apigee.net/gb/reference-data/v0/vehicles?registrationNumber=LWR82H';
ajax('GET',regHref,null,logResponse);

// Energy product variants
//ajax('POST','https://moneysupermarket-dev.apigee.net/gb/product/v1/search/energy-product-variants?facets=true',null,logResponse);

// MSMUX API TEST
//ajax('GET','http://private-1de44-msmmockresults.apiary-mock.com/results',null,logResponse);

// Using JQuery 1.5+
//var url = "https://moneysupermarket-dev.apigee.net/gb/reference-data/v0/vehicle-body-types";
//$.ajax({url: 'https://moneysupermarket-dev.apigee.net/gb/product/v1/search/energy-product-variants?facets=true',headers: {"client_id": "kG8gfeV92yEHrdXtdTuAGXtGXarLjqLc"},success: function(result){console.log(result);}});
//
//

</script>