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
    if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.errorMessage) {
        $('#errorPopup-text').text(jqXHR.responseJSON.errorMessage);
    } else if(typeof(errorThrown) != "undefined"){
        $('#errorPopup-text').text(errorThrown);
    } else if (typeof (textStatus) != "undefined") {
        $('#errorPopup-text').text(textStatus);
    }
    setTimeout(function () {
        $('#error-popup').popup('open');
    }, 250);
}

function showTextPopup(text) {
    $('#text-popup').popup('open');
    $('#textPopup-text').text(text);
}