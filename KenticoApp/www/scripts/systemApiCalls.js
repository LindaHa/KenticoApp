var system_api_url = "http://localhost:8080/kenticoapi/system/";

function restartServerApiCall() {
    showCustomLoadingMessage();
    var obj = {name:name, age:15};
    $.ajax({
        url: system_api_url + "restart-server",
        type: 'POST',
        success: function (response) {
            console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown){
            showAjaxError(jqXHR);
        },
        complete: function(){
            $('#restartServer-popup').popup('close');
            hideCustomLoadingMessage();
        }
    });
}