
var url = require('url')
var fs = require('fs')


function loadfromfile(path) {
    var contents = fs.readFileSync(path);
    console.log("debug", "Loading file at " + path)
    console.log("debug", "Contents " + contents)
    return (contents)
}

const config = JSON.parse(loadfromfile("./config.json"))

var apiBaseUri = "https://" + config.tenant + "-" + config.unit + ".instana.io"
console.log("The HREF is " + apiBaseUri)

var  applicationURL = apiBaseUri + "/api/application-monitoring/applications?windowSize=10&to=0&page=0&pageSize=100"
var servicesUri = apiBaseUri + "/api/application-monitoring/applications/services"
var hostCount = apiBaseUri + "/api/infrastructure-monitoring/monitoring-state"
var sensorList = apiBaseUri + "/api/infrastructure-monitoring/catalog/plugins"
var eventList = apiBaseUri + "/api/events"


function applicationListCallback(err, res, body){

    var applicationCounter = body.totalHits
    if (err) {
        console.dir(err)
        return
    }
    console.dir('headers', res.headers)
    console.dir('status code', res.statusCode)
    var applicationItems =  body.items
    applicationItems.forEach(function(value){

        var linkValue = "https://test-instana.instana.io/#/application;appId=" + value.id + "/summary"
        console.log("Application name is  " + value.id + " " + value.label + " " + linkValue);
    })
    console.log("There are " + body.totalHits + " Applications ")
}

function servicesListCallback(err, res, body){

    var servicesApiCall = '/api/application-monitoring/applications/services'
    var serviceCounter = body.totalHits
    if (err) {
        console.dir(err)
        return
    }
    console.log("There are " + body.totalHits + " Services ")
}


function getHostCount(err, response, body){

    var total = body.hostCount
    response.body = body.hostCount
    console.log("There are  " + body.hostCount + " Hosts ")

}


function applicationCountCallback(err, res, body){
    var applicationCounter = body.totalHits

    var link = "https://test-instana.instana.io/#/applications"
    console.log("There are " + body.totalHits + " Applications ")

}


function sensorListCallback(err, response, body) {

    var sensorCount = body.length
    console.log("There are " + sensorCount + " sensors ")
}



function evenListCallback(err, response, body) {
    var eventCount = body.length
    console.log("There are " + eventCount + " Events ")
}


function getInstanaRestAPI(apiuri, requestHandlerFunction) {

    console.log(apiuri)
    var request = require('request');
    var url = require('url');
    uri = apiuri
    var options = {
        uri,
        headers: {
            'Authorization':'apiToken '  + config.apiToken,
            'Content-Type': 'application/json'
        },
        method: "GET",
        json: true
    }
    postfinalresult = request(options, requestHandlerFunction)


}


console.log(`
Thanks for using the Instana APM system. So far Stan and our agents have accomplished the following. 
`)

getInstanaRestAPI(servicesUri, servicesListCallback)
getInstanaRestAPI(hostCount, getHostCount)
getInstanaRestAPI(applicationURL, applicationCountCallback)
getInstanaRestAPI(sensorList, sensorListCallback)
getInstanaRestAPI(eventList , evenListCallback)

