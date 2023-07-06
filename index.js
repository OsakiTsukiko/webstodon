onload = function () {
    if (localStorage.getItem("users") == null || localStorage.getItem("users") == "[]") {
        localStorage.setItem("users", JSON.stringify([]));
        load_screen("instance-selector");
        return
    }
    load_account_selector_screen();
}