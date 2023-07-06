function instance_selector_enter () {
    let error_element = document.getElementById("instance_selector_error");
    error_element.classList.add("error-hidden");

    let inp = document.getElementById("instance_selector_input");
    let value = inp.value;
    inp.value = "";

    value = value.replace("https://", "");
    value = value.replace("http://", "");
    // lets hope its https 💀
    // stuff might brake if http is used..

    if (value == null || value == undefined || value.replaceAll(" ", "") == "") {
        instance_selector_error("Invalid input!")
        return;
    }
    
    handle_instance_selector(value);
}

function instance_selector_error(err) {
    let error_element = document.getElementById("instance_selector_error");
    error_element.textContent = err;
    error_element.classList.remove("error-hidden");
}