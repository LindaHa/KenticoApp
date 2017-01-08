"use strict";

var authorization_api_url = system_api_domain + "/kenticoapi/authorization/";

//
 // This function gets the role by thegive ID.
 // param {roleId} the ID of the role we want to retrieve
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function getRoleApiCall(roleId, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + 'get-role/' + roleId,
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
 // This function gets all roles.
 //
function showAllRolesApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "/get-roles",
        type: 'GET',
        success: function onResponse(response) {
            var $tablebody = $('#showAllRoles-table');
            $tablebody.empty();
            for (var i = 0; i < response.roleList.length; i++) {
                var row = response.roleList[i];
                //creates the table of all roles, each with a delete and view button
                $tablebody.append(
                    '<tr id="rowOfRoles' + i + '">' +
                        '<td>' + row.RoleId + " : " + row.RoleDisplayName +'</td>' +
                        '<td class="td-second.special">' +
                            '<a id="viewRole' + i + '-btn" href="#viewRole-page" class="viewRole-btn ui-btn ui-corner-all ui-btn-icon-notext ui-icon-eye ui-shadow ui-btn-inline pull-right ui-mini"></a><br>' +
                        '</td>' +
                        '<td class="td-third">' +
                            '<a id="deleteRole' + i + '-btn" data-rel="popup" href="#deleteRole-popup" class="deleteRole-btn ui-btn ui-corner-all ui-btn-icon-notext ui-icon-delete ui-shadow ui-btn-inline pull-right ui-mini ui-btn-icon-notext"></a><br>' +
                        '</td>'+
                    '</tr>'
                );
                //adds listeners to the view and delete buttons
                (function (index, row2) {
                    $('#deleteRole' + index + '-btn').on('click', function () {
                        $('#deleteRoleYes-btn').off().on('click', function () {
                            deleteRoleApiCall(response.roleList[index].RoleId, function () {
                                $('#rowOfRoles' + index).remove();
                            });
                        });
                    });
                    $('#viewRole' + index + '-btn').on('click', function () {
                        createRolePermissionsTable(row2, $('#permissionsOfRole-table'), $('#roleName-h1'));
                    });
                })(i, row);          
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            $('#deleteRole-popup').popup('close');
            hideCustomLoadingMessage();
        }

    });
}

//
 // This function gets all permission of the role with the give ID.
 // param {roleId} the ID of the role for which we want to retrieve its permissions 
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function getRolePermissionsApiCall(roleId, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "get-permissions/" + roleId,
        type: 'GET',
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

//
 // This function creates a table with all permissions of a given role.
 // param {roleOrRoleId} if role ID the role is retrieved, the role for which the permissions are to be showed 
 // param {tableBody} the table where the permissions have to be displayed 
 // param {headerElement} the element where the role name has to be written 
 //
function createRolePermissionsTable(roleOrRoleId, tableBody, headerElement) {
    //checks if the first argument given is of type number, if so a role is assigned depending on the number
    if(typeof roleOrRoleId === "number"){
        getRoleApiCall(roleOrRoleId, function (data) {
            createRolePermissionsTable(data.role, tableBody, headerElement);
        });
        return;
    }
    //if the headerElement parameter is given it is filled with the role name
    tableBody.empty();
    if (headerElement !== null) {
        headerElement.html(roleOrRoleId.RoleId + ' : ' + roleOrRoleId.RoleDisplayName);
    }
    //gets the permissions of the role
    getRolePermissionsApiCall(roleOrRoleId.RoleId, function (result) {
        var permissions = result.permissionList;
        //fills the table with the role's permissions
        for (var i = 0; i < permissions.length; i++) {
            tableBody.append(
                '<tr id="permissionRow' + permissions[i].PermissionId + '">' +
                    '<td class="td-first"><span class="permission-name">' + permissions[i].PermissionId + ' : '
                    + permissions[i].PermissionDisplayName + " - " + permissions[i].PermissionDescription +
                    '</span></td>' +
                    '<td class="td-second">' +
                         '<a href="#removePermission-popup" data-rel="popup" id="removePermission' + i +
                         '-btn" class="pull-right ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-delete ui-btn-icon-notext ui-mini"></a><br>' +
                    '</td>' +
                '</tr>');
            //adds a listener to the removePermission buttons to make a future removal of a permission possible
            (function(index){
                $('#removePermission'+ index + '-btn').off().on('click', function(){
                    $('#removePermissionYes-btn').off().on('click', function(){
                        unassignPermissionsFromRolesApiCall([roleOrRoleId.RoleId], [permissions[index].PermissionId], function () {
                            tableBody.find('#permissionRow' + permissions[index].PermissionId).remove();
                        });                        
                    });                
                });                
            })(i);
        }
        //adds a listener to the opening of the #allPermissionsCheckbox-popup and fills it with all permissions with checkboxes
        $('#allPermissionsCheckbox-popup').off().on('popupafteropen', function () {
            createAllPermissionsCheckboxTable($('#allPermissionsCheckboxPopup-table'), null, null, $('#addSelectedPopupPermissions-btn'), function (selected) {
                assignPermissionsToRolesApiCall([roleOrRoleId.RoleId], selected, function () {
                    $('#allPermissionsCheckbox-popup').popup('close');
                    createRolePermissionsTable(roleOrRoleId, $('#permissionsOfRole-table'), $('#roleName-h1'));
                });
            });
        });
    });
}

//
 // This function delets a role by the given ID.
 // param {roleId} the role to be deleted
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function deleteRoleApiCall(roleId, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "delete-role/" + roleId,
        type: 'POST',
        success: function (response) {
            if (success_callback) success_callback(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR);
        },
        complete: function () {
            $('#deleteRole-popup').popup('close');
            hideCustomLoadingMessage();
        }
    });
}

//
 // This function gathers the data needed and ensures redirecting to create a new role.
 //
function createNewRole() {
    //creates a table with all permissions and checboxes
    createAllPermissionsCheckboxTable($('#allPermissionsCheckbox-table'), null, null, $('#createNewRole-btn'), function (selected) {
        var newRoleDisplayName = $('#newRoleDisplayName-input').val();
        var newRoleName = $('#newRoleName-input').val();
        //creates the role with the role name and display-name from the inputs
        createNewRoleApiCall(newRoleName, newRoleDisplayName, function (newRoleData) {
            //assigns the selected Premissions
            if (selected.length) {
                assignPermissionsToRolesApiCall([newRoleData.newRoleId], selected, function () {
                    createRolePermissionsTable(newRoleData.newRoleId, $('#permissionsOfRole-table'), $('#roleName-h1'));
                });
            }
            //redirects to the #viewRole-page
            $.mobile.changePage("#viewRole-page");
            //Clears the form
            $('#newRoleDisplayName-input').val('');
            $('#newRoleName-input').val('');
            $('#allPermissionsCheckbox-table input:checked').each(function () {
                $(this).prop('checked', false);
            });
        }, function () {
            createNewRole;
        });
    });
}

//
 // This function creates a new role.
 // {roleName} the new name of the role
 // {roleDisplayName} the new display name of the role
 // {success_callback} the function describes what is to happen if the call is succesful
 // {error_callback} the function describes what is to happen if the call is not succesful
 //
function createNewRoleApiCall(roleName, roleDisplayName, success_callback, error_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "create-new-role",
        type: 'POST',
        dataType: "json",
        data: {
            roleName: roleName,
            roleDisplayName: roleDisplayName
        },
        success: function (data) {
            if (success_callback) success_callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR, textStatus, errorThrown);
            if (error_callback) error_callback(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            hideCustomLoadingMessage();
        }
    });
}

//
 // This function gets all permissions.
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function getAllPermissionsApiCall(success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "get-all-permissions",
        type: 'GET',
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

//
 // This function creates a checkbox of all permissions.
 // {tableBody} the table body where the checkbox is to be created
 // {headerElement} the element where the text will appear
 // {text} the text to appear in the headerElement
 // {button} a listener can be added to this button element
 // {on_click_selected_required} the function which is to happen after clicking the button
 //
function createAllPermissionsCheckboxTable(tableBody, headerElement, text, button, on_click_selected_required) {   
    tableBody.empty();
    //if the headerElement and the text is given it is filled with the text
    if (headerElement !== null && text !== null) {
        headerElement.html(text);
    }
    //gets all permissions 
    getAllPermissionsApiCall(function (result) {
        var permissions = result.permissionList;
        // fills the tablebody with the permissions
        for (var i = 0; i < permissions.length; i++) {
            var r = permissions[i];
            var description = r.PermissionDescription;
            if (description) {
                description = r.PermissionDescription.substring(0, 30) + '...';
            }            
            tableBody.append(
                '<tr>' +
                    '<td class="td-first"><span class="permission-name">'
                         + r.PermissionDisplayName + " - " +
                        '<a id = "permissionDescription' + i + '-a" href="#">' + description + '</a></td>' +
                    '</span></td>' +
                    '<td class="td-second">' +
                        '<input type="checkbox" name="allPermissions" id="allPermissionsCheckbox' + i + '" value="' + r.PermissionId + '" class="pull-right"><br>' +                    
                    '</td>' +
                '</tr>');
            //adds a listener to the permission description href, if clicked a popup with the full description pops up
            (function (row, index) {
                $('#permissionDescription' + index + '-a').on('click', function () {
                    showTextPopup(row.PermissionDescription);
                });
            })(r, i);
        }
        //add a listener to the button
        button.off().on('click', function () {
            //get the checked permissions
            var selected = [];
            tableBody.find('input:checked').each(function () {
                selected.push($(this).val());
            });
            //if the on_click_selected_required function is given it operates the selected permissions
            if (on_click_selected_required) on_click_selected_required(selected);
        });
    });
}

//
 // This function assigns the given permissions to the given roles.
 // param {roleIds} the IDs of the roles to which the given permissions are to be assigned
 // param {permissionIds}  the IDs of the permissions that are to be assigned
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function assignPermissionsToRolesApiCall(roleIds, permissionIds, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "assign-permissions-to-roles",
        type: 'POST',
        dataType: "json",
        data: {
            roleIds: roleIds,
            permissionIds: permissionIds
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

//
 // This function unassigns the given permissions from the given roles.
 // param {roleIds} the IDs of the roles from which the given permissions are to be unassigned
 // param {permissionIds}  the IDs of the permissions that are to be unassigned 
 // param {success_callback} the function describes what is to happen if the call is succesful
 //
function unassignPermissionsFromRolesApiCall(roleIds, permissionIds, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "unassign-permissions-from-roles",
        type: 'POST',
        dataType: "json",
        data: {
            roleIds: roleIds,
            permissionIds: permissionIds
        },
        success: function (data) {
            if (success_callback) success_callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showAjaxError(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            $('#removePermission-popup').popup('close');
            hideCustomLoadingMessage();
        }
    });
}

