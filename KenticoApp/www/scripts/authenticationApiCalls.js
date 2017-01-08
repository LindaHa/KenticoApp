"use strict";

var authentication_api_url = system_api_domain + "/kenticoapi/authentication/";

//
 // This function gets the current user.
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function getCurrentUserApiCall(success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        //the address where the user is returned
        url: authentication_api_url + 'get-current-user',
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

//
 // This function authenticates the user who is attempting to sign in.
 // param {username} the username of the user attempting to sign in
 // param {password} the password of the user attempting to sign in
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function authenticateUserApiCall(username, password, success_callback) {
    showCustomLoadingMessage();
    access_token = null;
    $('.user-profile-btn').text('Dearest');
    $.ajax({
        url: authentication_api_url + "authenticate-user",
        type: 'POST',
        dataType: "json",
        data: {
            username: username,
            password: password
        },
        success: function (data) {
            access_token = data.token.Code;
            if (success_callback) success_callback(data);
            //the user who successfuly signed in is retrieved and the username appears on the user-profile-btn
            getCurrentUserApiCall(function (data) {
                $('.user-profile-btn').text(data.UserName);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

//
 // This function signs the user out.
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function signOutUserApiCall(success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authentication_api_url + "sign-out-user",
        type: 'POST',
        dataType: "json",
        success: function (data) {
            access_token = null;
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

//
 // This function adds a listener to the #logUserOutYes-btn which when clicked signs the user out.
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function addListenersToLogoutBtn(){
    $('#logUserOutYes-btn').on('click', function () {
        signOutUserApiCall();
    });
}

//
 // This function adds a listener to the #login-btn which when clicked signs the user in.
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function addListenersToLoginForm() {
    $('#login-btn').on('click', function(){
        authenticateUserApiCall($('#usrname-input').val(), $('#passwrd-input').val(), function () {
            $.mobile.changePage("#menu-page");
        });
    });
}