$(document).ready(function() {
    var startTracking = function(cHost, cUsername, cPassword) {
        cHost = cHost || "";
        cUsername = cUsername || "";
        cPassword = cPassword || "";

        // Save in storage
        chrome.storage.sync.set({
            'host': cHost.toString(),
            'username': cUsername.toString(),
            'password': cPassword.toString(),
            'update': Date.now()
        }, function() {
        });

        $("#host").val(cHost);
        $("#username").val(cUsername);
        $("#password").val(cPassword);
    };

    // Load settings
    chrome.storage.sync.get(['host', 'username', 'password'], function(data) {
        startTracking(data.host, data.username, data.password)
    });

    // Bind settings
    $("#submit").click(function() {
        startTracking($("#host").val(), $("#username").val(), $("#password").val());
    });
});