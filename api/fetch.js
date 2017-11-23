var ajax = function(method,url,data,callback) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);
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

var getAddressFromPostcode = function(postcode){
    var proxyRef = 'https://jamesnash-trial-prod.apigee.net/msmuxproxy/reference-data/v0/addresses?postcode='+postcode;
    ajax('GET',proxyRef,null,logResponse);
};

//document.getElementById('addressBtn').addEventListener('click',function(){
//    getAddressFromPostcode(document.getElementById('postcode').value);
//});

var getVehicleFromReg = function(reg){
    var proxyRef = 'https://jamesnash-trial-prod.apigee.net/msmuxproxy/reference-data/v0/vehicles?registrationNumber='+reg;
    ajax('GET',proxyRef,null,lookUp);
};

//document.getElementById('vehicleBtn').addEventListener('click',function(){
//    getVehicleFromReg(document.getElementById('reg').value);
//});

var cars = function(input){
	var request = 'http://'
}
