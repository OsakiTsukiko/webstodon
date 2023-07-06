function load_screen(screen_id) {
    for (let screen_cont of document.getElementsByClassName("screen-cont")) {
        screen_cont.classList.remove("screen-cont-selected");
    }

    let s_screen_cont = document.getElementById(screen_id + "-screen-cont");
    if (s_screen_cont == null || s_screen_cont == undefined) {
        // TODO: ADD ERROR SCREEN
        return;
    }

    s_screen_cont.classList.add("screen-cont-selected");
}

function save_acc (p_instance, p_token) {
    var value = JSON.parse(localStorage.getItem("users"));
    value.push(
        {
            instance: p_instance,
            token: p_token
        }
    )
    localStorage.setItem("users", JSON.stringify(value));
}

function remove_acc (acc) {
    var value = JSON.parse(localStorage.getItem("users"));
    value.splice(value.indexOf(acc), 1);
    localStorage.setItem("users", JSON.stringify(value));
}

function remove_acc_by_index (i) {
    var value = JSON.parse(localStorage.getItem("users"));
    value.splice(i, 1);
    localStorage.setItem("users", JSON.stringify(value));
}

function load_account_selector_screen () {
    document.getElementById("acc-selector-cont").innerHTML = "";
    load_screen("acc-selector");
    var accounts = JSON.parse(localStorage.getItem("users"));
    for (i in accounts) {
        let account = accounts[i];
        // console.log(account);
        /* if (!accounts.hasOwnProperty("instance") || !accounts.hasOwnProperty("token")) {
            remove_acc_by_index(i);
            continue;
        } */
        
        httpGetAsyncHP(
            "https://" + account.instance + "/api/v1/accounts/verify_credentials",
            [
                {
                    "key": "Authorization",
                    "value": "Bearer " + account.token
                }
            ],
            verify_credentials,
            {account: account, index: i}
        )
    }
}