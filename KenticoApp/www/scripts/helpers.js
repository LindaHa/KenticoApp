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

function showAjaxError(jqXHR) {
    $('#error-popup').popup('open');
    $('#errorPopup-text').text(jqXHR.responseJSON.errorMessage);
}

function showTextPopup(text) {
    $('#text-popup').popup('open');
    $('#textPopup-text').text(text);
}