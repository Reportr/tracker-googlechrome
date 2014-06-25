var config = {};

var doRequest = function(method, path, body, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, config.host+"/api/"+path, true);
    xhr.setRequestHeader("Content-type","application/json");
    xhr.setRequestHeader("Authorization", "Basic " + btoa(config.username + ":" + config.password));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback();
        }
    }
    xhr.send(body? JSON.stringify(body) : undefined);
};

var start = function(data) {
    if (!data.host || !data.username || !data.password) {
        console.error("Invalid settings", data);
        return;
    }
    console.log("New settings", data);
    config = data;
};


chrome.history.onVisited.addListener(function(item) {
    console.log("Track visit ", item);

    var matches = item.url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
    var domain = matches && matches[1];

    doRequest("POST", "events", {
        'type': "chrome.visit",
        'properties': {
            "url": item.url,
            "title": item.title,
            'domain': domain
        }
    });
});
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log("Changes in settings", changes);
    chrome.storage.sync.get(['host', 'username', 'password'], function(data) {
        start(data);
    });
});
chrome.storage.sync.get(['host', 'username', 'password'], function(data) {
    start(data)
});