var system_api_url = system_api_domain + "/kenticoapi/users/";

function getAllUsersApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: system_api_url,
        type: 'GET',
        success: function onResponse(response) {
            var $tablebody = $('#users-table');
            $tablebody.empty();
            for (var i = 0; i < response.usersList.length; i++){
                var r = response.usersList[i];
                $tablebody.append(
                    '<tr>' +
					    '<td class="td-first">' + r.UserId + ' : ' + r.Username + '</td>' +
                        '<td class="td-second">' +
						'<a id="editUser' + i + '-btn" href="#editUser-page" class="editUser-btn ui-btn ui-corner-all ui-btn-icon-notext ui-icon-edit ui-shadow ui-btn-inline pull-right ui-mini">Edit User</a><br>' +
                        '</td>'+
                    '</tr>');
                (function (row, index) {
                    $('#editUser' + index + '-btn').on('click', function () {
                        $('#userIdEdit-input').val(row.UserId);
                        $('#usernameEdit-input').val(row.Username);
                        $('#nameEdit-input').val(row.FirstName);
                        $('#surnameEdit-input').val(row.Surname);

                        var $tablebody2 = $('#userRoles-table');
                        $tablebody2.empty();
                        for (var j = 0; j < row.Roles.length; j++) {
                            $tablebody2.append(
                                '<tr>' +
                                    '<td class="td-first"><span class="role-name">' + row.Roles[j] + '</span></td>' +
                                    '<td class="td-second">' +
                                         '<a href="#removeRole-popup" data-rel="popup" id="removeRole' + j + '-btn" class="pull-right ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-delete ui-btn-icon-notext ui-mini"></a><br>' +
                                    '</td>' +  
                                '</tr>');
                            (function (index2) {
                                $('#removeRole' + index2 + '-btn').on('click', function () {
                                    $('#removeRoleYes-btn').off().on('click', function () {
                                        removeUsersFromRolesApiCall([row.Username], [row.Roles[index2]]);
                                    });
                                });                                
                            })(j);
                        }
                    });
                })(r, i)

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

function removeUsersFromRolesApiCall(usernames, roleNames) {
    showCustomLoadingMessage();
    $.ajax({
        url: system_api_url + "remove-users-from-roles",
        type: 'POST',
        dataType: "json",
        data: {
            usernames: usernames,
            roleNames: roleNames
        },
        success: function (response) {
            $('#userRoles-table .role-name').each(function () {
                if ($.inArray($(this).html(), roleNames) != -1) {
                    $(this).parent().parent().remove();     
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            $('#removeRole-popup').popup('close');
            hideCustomLoadingMessage();
        }
    });
}