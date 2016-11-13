"use strict";

var user_api_url = system_api_domain + "/kenticoapi/users/";

function viewCurrentUser() {
    var user = getCurrentUserApiCall(function () {
        $('#userView- page').on('show', function () {
            $('#currentUserNameEdit-input').val(user.FirstName);
            $('#currentUserSurnameEdit-input-input').val(user.LastName);
            $('#currentUserUsrnameEdit-input-input').val(user.Username);
            $('#currentUserPasswrdRepeat-input-input').val('');
            $('#currentUserPasswrdRepeat-input-input').val('');
         });       
    });
    $('#saveEditCurrentUser-btn').off().on('click', function () {
        editUserUsersApiCalls($('#usernameEdit-input').val(), $('#nameEdit-input').val(), $('#surnameEdit-input').val());
    });
    $('#cancelEditCurrentUser-btn').off().on('click', function () {
        $('#nameEdit-input').val(row.FirstName);
        $('#surnameEdit-input').val(row.Surname);
    });
}

function getAllUsersApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: user_api_url,
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
                        $('#editUserHeader-h1').html(row.UserId + ' : ' + row.Username);

                        $('#userIdEdit-input').val(row.UserId);
                        $('#usernameEdit-input').val(row.Username);
                        $('#nameEdit-input').val(row.FirstName);
                        $('#surnameEdit-input').val(row.Surname);

                        var tablebody2 = $('#userRoles-table');
                        createUserRolesTable(row.Username, row.Roles, tablebody2);
                        $('#saveEditUser-btn').off().on('click', function () {
                            editUserUsersApiCalls($('#usernameEdit-input').val(), $('#nameEdit-input').val(), $('#surnameEdit-input').val());
                        });
                        $('#cancelEditUser-btn').off().on('click', function () {
                            $('#nameEdit-input').val(row.FirstName);
                            $('#surnameEdit-input').val(row.Surname);
                        });
                        $('#addRole-btn').off().on('click', function(){
                            getRolesApiCall(function(response) {
                                var formbody = $('#allRolesCheckbox-form');
                                formbody.empty();
                                for (var i = 0; i < response.roleList.length; i++) {
                                    var r = response.roleList[i];
                                    formbody.append(
                                       '<label for="allRolesCheckbox' + i + '">' + r.RoleDisplayName + '</label>' +
                                       '<input type="checkbox" name="allRoles" id="allRolesCheckbox' + i + '" value="' + r.RoleId + '">'
                                    );
                                }
                            });
                        });
                        $('#addSelectedRoles-btn').off().on('click', function () {
                            var selected = [];
                            $('#allRolesCheckbox-form input:checked').each(function () {
                                selected.push($(this).val());
                            });
                            addUsersToRolesApiCall([row.Username], selected, kentico_site_name, function () {
                                getRolesApiCall(function (response) {
                                    var allRoles = response.roleList;
                                    for (var l = 0; l < selected.length; l++) {
                                        for (var k = 0; k < allRoles.length; k++) {
                                            if (allRoles[k].RoleId == selected[l]) {
                                                row.Roles.push(allRoles[k].RoleDisplayName);
                                                break;
                                            }
                                        }
                                    }
                                    createUserRolesTable(row.Username, row.Roles, tablebody2);
                                });
                            });
                        });

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

function removeUsersFromRolesApiCall(usernames, roleNames, siteName, success_callback) {
    if (typeof (siteName) === "undefined") siteName = kentico_site_name;
    showCustomLoadingMessage();
    $.ajax({
        url: user_api_url + "remove-users-from-roles",
        type: 'POST',
        dataType: "json",
        data: {
            usernames: usernames,
            roleNames: roleNames,
            siteName: siteName
        },
        success: function (response) {
            if (success_callback) success_callback(response);
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

function addUsersToRolesApiCall(usernames, roleIds, siteName, success_callback) {
    if (typeof (siteName) === "undefined") siteName = kentico_site_name;
    showCustomLoadingMessage();
    $.ajax({
        url: user_api_url + "add-users-to-roles",
        type: 'POST',
        dataType: "json",
        data: {
            usernames: usernames,
            roleIds: roleIds,
            siteName: siteName
        },
        success: function (response) {
            if (success_callback) success_callback(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            $('#allRolesCheckbox-popup').popup('close');
            hideCustomLoadingMessage();
        }
    });
}

function getRolesApiCall(success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "get-roles",
        type: 'GET',
        success: function (data) {
            if(success_callback) success_callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

function createUserRolesTable(username, roles, tableBody) {
    tableBody.empty();
     for (var j = 0; j < roles.length; j++) {
        tableBody.append(
            '<tr>' +
                '<td class="td-first"><span class="role-name">' + roles[j] + '</span></td>' +
                '<td class="td-second">' +
                     '<a href="#removeRole-popup" data-rel="popup" id="removeRole' + j +
                     '-btn" class="pull-right ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-delete ui-btn-icon-notext ui-mini"></a><br>' +
                '</td>' +  
            '</tr>');
        (function (index2) {
            $('#removeRole' + index2 + '-btn').on('click', function () {
                $('#removeRoleYes-btn').off().on('click', function () {
                    removeUsersFromRolesApiCall([username], [roles[index2]], kentico_site_name, function (response) {
                        roles.splice(index2, 1);
                        createUserRolesTable(username, roles, tableBody);
                    });
                });
            });                                
        })(j);
    }
}

function editUserUsersApiCalls(username, firstName, surname, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: user_api_url + "edit-user",
        type: 'POST',
        data: {
            username: username,
            firstName: firstName,
            surname: surname,
        },
        success: function (data) {
            if (success_callback) success_callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}
   