"use strict";

var user_api_url = system_api_domain + "/kenticoapi/users/";

//
 // This function shows the details about the current user.
 //
function viewCurrentUser() {
    //gets the current user and the information are put in the following elements
    getCurrentUserApiCall(function (data) {
        $('#currentUserUsername').text(data.UserName);
        $('#currentUserNameEdit-input').val(data.FirstName);
        $('#currentUserSurnameEdit-input').val(data.LastName);
        //$('#currentUserPasswrdRepeat-input').val('');
        //$('#currentUserPasswrdRepeat-input').val('');

        //adds a listener to the #saveEditCurrentUser-btn, after clicking it the changes to the user are saved
        $('#saveEditCurrentUser-btn').off().on('click', function () {
            editUserUsersApiCall(data.UserName, $('#currentUserNameEdit-input').val(), $('#currentUserSurnameEdit-input').val(), function () {
                data.FirstName = $('#currentUserNameEdit-input').val();
                data.LastName = $('#currentUserSurnameEdit-input').val();
            });
        });
        //adds a listener to the #cancelEditCurrentUser-btn, after clicking it the changes to the user are canceled and the
        //original information reappear
        $('#cancelEditCurrentUser-btn').off().on('click', function () {
            $('#currentUserNameEdit-input').val(data.FirstName);
            $('#currentUserSurnameEdit-input').val(data.LastName);
        });
    });    
}

//
 // This function gets all users and presents them in a table.
 //
function getAllUsersApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: user_api_url,
        type: 'GET',
        success: function onResponse(response) {
            var $tablebody = $('#users-table');
            $tablebody.empty();
            //fills the table with the user information
            for (var i = 0; i < response.usersList.length; i++){
                var r = response.usersList[i];
                $tablebody.append(
                    '<tr>' +
                        '<td class="td-first">' + r.UserId + ' : ' + r.Username + '</td>' +
                        '<td class="td-second">' +
						'<a id="editUser' + i + '-btn" href="#editUser-page" class="editUser-btn ui-btn ui-corner-all ui-btn-icon-notext ui-icon-edit ui-shadow ui-btn-inline pull-right ui-mini">Edit User</a><br>' +
                        '</td>'+
                    '</tr>');
                //adds listeners to buttons
                (function (row, index) {
                    //after clicking this button the current user is redirected to a page where details of a selected user 
                    //are showed and can be edited 
                    $('#editUser' + index + '-btn').on('click', function () {
                        $('#editUserHeader-h1').html(row.UserId + ' : ' + row.Username);

                        $('#userIdEdit-input').val(row.UserId);
                        $('#usernameEdit-input').val(row.Username);
                        $('#nameEdit-input').val(row.FirstName);
                        $('#surnameEdit-input').val(row.Surname);
                        //the roles of a selected user are showed in a table
                        var tablebody2 = $('#userRoles-table');
                        createUserRolesTable(row.Username, row.Roles, tablebody2);
                        //after clicking this button the changes to the viewed user are saved
                        $('#saveEditUser-btn').off().on('click', function () {
                            editUserUsersApiCall($('#usernameEdit-input').val(), $('#nameEdit-input').val(), $('#surnameEdit-input').val(), function () {
                                row.FirstName = $('#nameEdit-input').val();
                                row.Surname = $('#surnameEdit-input').val();
                            });
                        });
                        //after clicking this button the changes to the viewed user are canceled and the original information appears
                        $('#cancelEditUser-btn').off().on('click', function () {
                            $('#nameEdit-input').val(row.FirstName);
                            $('#surnameEdit-input').val(row.Surname);
                        });
                        //after clicking this button a checbox-table with all roles is shown
                        $('#addRole-btn').off().on('click', function () {
                            getRolesApiCall(function (response) {
                                var table = $('#allRolesCheckbox-table');
                                table.empty();
                                //displays all roles in a checkbo-table
                                for (var i = 0; i < response.roleList.length; i++) {
                                    var r = response.roleList[i];
                                    table.append(
                                        '<tr>' +
                                           '<td><label for="allRolesCheckbox' + i + '">' + r.RoleDisplayName + '</label></td>' +
                                           '<td class="allRolesCheckboc-input"><input type="checkbox" name="allRoles" id="allRolesCheckbox' + i + '" value="' + r.RoleId + '"></td>' +
                                        '</tr>'
                                    );
                                }
                            });
                        });
                        //after clicking this button the selected roles are added to the viewed user
                        $('#addSelectedRoles-btn').off().on('click', function () {
                            var selected = [];
                            //retrieves the selected input
                            $('.allRolesCheckboc-input input:checked').each(function () {
                                selected.push($(this).val());
                            });
                            addUsersToRolesApiCall([row.Username], selected, kentico_site_name, function () {
                                getRolesApiCall(function (response) {
                                    var allRoles = response.roleList;
                                    for (var l = 0; l < selected.length; l++) {
                                        for (var k = 0; k < allRoles.length; k++) {
                                            if (allRoles[k].RoleId === selected[l]) {
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
                })(r, i);

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

//
 // This function removes users from roles.
 //param {usernames} the usernames of the users to be unassigned from the given roles
 //param {roleNames} the rolenames from which the users are to be unassigned
 //param {siteName} the name of the site where the users and roles are relevant
 //param {success_callback} the function describes what is to happen if the call is succesful
 //
function removeUsersFromRolesApiCall(usernames, roleNames, siteName, success_callback) {
    //if the siteName is not given its default value is kentico_site_name
    if (typeof siteName === "undefined") siteName = kentico_site_name;
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

//
 // This function adds users to roles.
 //param {usernames} the usernames of the users to be assigned to the given roles
 //param {roleNames} the rolenames to which the users are to be assigned
 //param {siteName} the name of the site where the users and roles are relevant
 //param {success_callback} the function describes what is to happen if the call is succesful
 //
function addUsersToRolesApiCall(usernames, roleIds, siteName, success_callback) {
    if (typeof siteName === "undefined") siteName = kentico_site_name;
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

//
 // This function gets all roles.
 //param {success_callback} the function describes what is to happen if the call is succesful
 //
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

//
 // This function creates a table whith roles of a user.
 //param {username} the username of the user whose roles are to be shown
 //param {roles} the roles which are to be displayed
 //param {tableBody} the function describes what is to happen if the call is succesful
 //
function createUserRolesTable(username, roles, tableBody) {
    tableBody.empty();
    //fills the table with role information
     for (var j = 0; j < roles.length; j++) {
        tableBody.append(
            '<tr>' +
                '<td class="td-first"><span class="role-name">' + roles[j] + '</span></td>' +
                '<td class="td-second">' +
                     '<a href="#removeRole-popup" data-rel="popup" id="removeRole' + j +
                     '-btn" class="pull-right ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-delete ui-btn-icon-notext ui-mini"></a><br>' +
                '</td>' +  
            '</tr>');
         //adds a listener to the button below, after clicking it the role is removed from the user
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

//
 // This function edits the user.
 //param {username} the username of the user to be edited
 //param {firstName} the new first name of the user
 //param {surname} the new surname of the user
 //param {success_callback} the function describes what is to happen if the call is succesful
 //
function editUserUsersApiCall(username, firstName, surname, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: user_api_url + "edit-user",
        type: 'POST',
        data: {
            username: username,
            firstName: firstName,
            surname: surname
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
   