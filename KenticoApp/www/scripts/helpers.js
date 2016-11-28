function showCustomLoadingMessage(){
    $("body").addClass('ui-disabled');
    $.mobile.loading('show', {
        text: 'Processing, please wait..',
        textVisible: true,
        theme: 'a',
        html: ""
    });
}

function hideCustomLoadingMessage() {
    $("body").removeClass('ui-disabled');
    $.mobile.loading('hide');
}

function showAjaxError(jqXHR, textStatus, errorThrown) {
    if (jqXHR && jqXHR.status == 403) {
        $.mobile.changePage("#welcome-page");
        $('#errorPopup-text').text("You need to be logged in as a GLOBAL ADMINISTRATOR.");
    } else if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.errorMessage) {
        $('#errorPopup-text').text(jqXHR.responseJSON.errorMessage);
    } else if(typeof(errorThrown) != "undefined"){
        $('#errorPopup-text').text(errorThrown);
    } else if (typeof (textStatus) != "undefined") {
        $('#errorPopup-text').text(textStatus);
    } else {
        $('#errorPopup-text').text("Unknown Error!");
    }
    setTimeout(function () {
        $('#error-popup').popup('open');
    }, 250);
}

function showTextPopup(text) {
    $('#text-popup').popup('open');
    $('#textPopup-text').text(text);
}