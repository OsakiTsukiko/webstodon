// not actually the token but ok...

function token_enter () {
    let error_element = document.getElementById("token_error");
    error_element.classList.add("error-hidden");

    let inp = document.getElementById("token_input");
    let value = inp.value;
    inp.value = "";

    if (value == null || value == undefined || value.replaceAll(" ", "") == "") {
        token_error("Invalid input!")
        return;
    }
    
    handle_auth_code(value);
}

function token_error (err) {
    let error_element = document.getElementById("token_error");
    error_element.textContent = err;
    error_element.classList.remove("error-hidden");
}

function token_link (url) {
    let link_element = document.getElementById("token_link");
    link_element.href = url;
}