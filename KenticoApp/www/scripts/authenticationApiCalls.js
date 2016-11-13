"use strict"

var authentication_api_url = system_api_domain + "/kenticoapi/authentification/";

function getCurrentUserApiCall(success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authentication_api_url + 'get-current-user/',
        type: 'GET',
        success: function (response) {
            if (success_callback) success_callback(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

function authenticateUserApiCall(username, password, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authentication_api_url + "authenticate-user",
        type: 'POST',
        dataType: "json",
        data: {
            username: username,
            password: password,
        },
        success: function (data) {
            if (success_callback) success_callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

function addListenersToLoginForm() {
    $('#login-btn').on('click', function(){
        authenticateUserApiCall($('#usrname-input').value, $('#passwrd-input').value, function () {
            $.mobile.changePage("#menu-page");
        });
    });
}