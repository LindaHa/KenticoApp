var system_api_url = system_api_domain + "/kenticoapi/users/";

function getAllUsersApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: system_api_url,
        type: 'GET',
        success: function onResponse(response) {
            var $tablebody = $('#users-table');
            $tablebody.empty();
            for (var i = 0; i < response.length; i++){
                var r = response[i];
                $tablebody.append(
                    '<tr>' +
					    '<td class="td-first">' + r.UserID + '  ' + r.Surname + ' ' + r.FirstName + '</td>' +
						//'<a class="td-second" id="editUser' + i + '-btn" href="#editUser-page" class="editUser-btn ui-btn ui-corner-all ui-btn-icon-notext ui-icon-edit ui-shadow ui-btn-inline pull-right ui-mini">Edit User</a><br>' +
                    '</tr>');
                //(function (row, index) {
                //    $('#editUser' + index + '-btn').on('click', function () {
                //        window.location = "#editUser-page";
                //    });
                //})(r, i)                    
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}