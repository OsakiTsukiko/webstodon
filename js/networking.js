// SESSION STUFF
let instance_address;
let instance;
let access_token;

let client_info = {
    auth_code: undefined, // token
    client_id: undefined,
    client_secret: undefined
}



function httpGetAsync (url, callback) // very consistent function naming ..
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = (e) => { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
            return
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function httpGetAsyncH (url, headers, callback) // very consistent function naming ..
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = (e) => { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
            return
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    for (header of headers) {
        xmlHttp.setRequestHeader(header.key, header.value);
    }
    xmlHttp.send(null);
}

function httpGetAsyncHP (url, headers, callback, parameters) // very consistent function naming ..
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = (e) => { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp, parameters);
            return
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    for (header of headers) {
        // console.log(header)
        xmlHttp.setRequestHeader(header.key, header.value);
    }
    xmlHttp.send(null);
}

function httpPostAsync (url, req_body, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = (e) => {
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
            return
        // error...
    }
    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(req_body));
}

function httpPostAsyncH (url, req_body, headers, callback) {
    /*
    Header {
        key: v,
        value: v
    }
    */
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = (e) => {
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
            return
        // error...
    }
    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    for (header of headers) {
        xmlHttp.setRequestHeader(header.key, header.value);
    }
    xmlHttp.send(JSON.stringify(req_body));
}

function handle_instance_selector (value) {
    load_screen("loading");

    instance_address = "https://" + value + "/";
    instance = value;

    try {
        httpGetAsync(instance_address + "api/v1/timelines/public?limit=1", check_if_instance_exists)
    } catch (err) {
        load_screen("instance-selector");
        instance_selector_error("Unable to connect to instance!");
    }
}

function check_if_instance_exists (xmlHttp) {
    if (xmlHttp.status != 200) {
        load_screen("instance-selector");
        instance_selector_error("Unable to connect to instance!");
    }
    // TODO: SAVE INSTANCE

    httpPostAsync(
        instance_address + "api/v1/apps",
        {
            "client_name": "webstodon",
            "redirect_uris": "urn:ietf:wg:oauth:2.0:oob",
            "scopes": "read write follow push",
            "website": "https://osakitsukiko.github.io" // TODO: WEBSITE..
        },
        create_application
    )
}

function create_application (xmlHttp) {
    if (xmlHttp.status != 200) {
        load_screen("loading");
        // TODO: STH WENT WRONG SCREEN
        return;
    }

    let response = JSON.parse(xmlHttp.response);
    client_info.client_id = response.client_id;
    client_info.client_secret = response.client_secret;
    let oauth_url = instance_address + "oauth/authorize?client_id=" + client_info.client_id + "&scope=read+write+follow+push&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code";
    window.open(oauth_url, "_blank");
    // browser might not allow page to open popup

    load_screen("token");
    token_link(oauth_url);
}

function handle_auth_code (value) {
    load_screen("loading");
    client_info.auth_code = value

    httpPostAsync(
        instance_address + "oauth/token",
        {
            "client_id": client_info.client_id,
            "client_secret": client_info.client_secret,
            "redirect_uri": "urn:ietf:wg:oauth:2.0:oob",
            "grant_type": "authorization_code",
            "code": value,
            "scope": "read write follow push"
        },
        get_access_token
    )
}

function get_access_token (xmlHttp) {
    if (xmlHttp.status != 200) {
        load_screen("loading");
        // TODO: STH WENT WRONG SCREEN
        return;
    }

    let response = JSON.parse(xmlHttp.response);
    access_token = response.access_token;

    save_acc(instance, access_token);
    load_account_selector_screen();
}

function verify_credentials(xmlHttp, parameters) {
    if (xmlHttp.status != 200) {
        load_screen("loading");
        // TODO: STH WENT WRONG SCREEN
        return;
    }

    let response = JSON.parse(xmlHttp.response);
    // console.log(response);

    /* if (response.hasOwnProperty("error")) {
        // remove_acc_by_index(parameters[1]);
        return;
    } */

    let acc = `
    <div class="acc">
        <img src="${response.avatar_static}">
        <span>${response.username}@${parameters.account.instance}</span>
    </div>
    `;

    document.getElementById("acc-selector-cont").innerHTML += acc;
}