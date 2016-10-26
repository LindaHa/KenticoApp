"use strict";

var authorization_api_url = system_api_domain + "/kenticoapi/authorization/";

function getRole(roleId, success_callback) {
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
                (function (index2) {
                    $('#deleteRole' + index2 + '-btn').on('click', function () {
                        $('#deleteRoleYes-btn').off().on('click', function () {
                            deleteRoleApiCall(response.roleList[index2].RoleId, function () {
                                $('#rowOfRoles' + index2).remove();
                            });
                        });
                    });
                })(i);
                (function (row2, index) {
                    $('#viewRole' + index + '-btn').on('click', function () {
                        createRolePermissionsTable(row2, $('#permissionsOfRole-table'), $('#roleName-h1'));
                        $('#allPermissionsCheckbox-popup').on('popupafteropen', function () {
                            createAllPermissionsCheckboxTable($('#allPermissionsCheckboxPopup-table'), null, null, $('#addSelectedPopupPermissions-btn'), function (selected) {
                                assignPermissionsToRolesApiCall([row2.RoleId], selected, function () {
                                    $('#allPermissionsCheckbox-popup').popup('close');
                                    createRolePermissionsTable(row2, $('#permissionsOfRole-table'), $('#roleName-h1'));
                                });
                            });                            
                        });
                    });
                })(row, i);               
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

function createRolePermissionsTable(roleOrRoleId, tableBody, headerElement) {
    if(typeof roleOrRoleId === "number"){
        getRole(roleOrRoleId, function (data) {
            createRolePermissionsTable(data.role, tableBody, headerElement);
        });
        return;
    } 
    tableBody.empty();
    if (headerElement != null) {
        headerElement.html(roleOrRoleId.RoleId + ' : ' + roleOrRoleId.RoleDisplayName);
    }
    getRolePermissionsApiCall(roleOrRoleId.RoleId, function (result) {
        var permissions = result.permissionList;
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
    });
}

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

function createNewRoleApiCall(roleName, roleDisplayName, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "create-new-role",
        type: 'POST',
        dataType: "json",
        data: {
            roleName: roleName,
            roleDisplayName: roleDisplayName,
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

function createAllPermissionsCheckboxTable(tableBody, headerElement, text, button, on_click_selected_required) {   
    tableBody.empty();
    if (headerElement != null && text != null) {
        headerElement.html(text);
    }
    getAllPermissionsApiCall(function (result) {
        var permissions = result.permissionList;
        for (var i = 0; i < permissions.length; i++) {
            var r = permissions[i];
            var description = r.PermissionDescription
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
            (function(row, index){
                $('permissionDescription' + index + '-a').on('click', function () {
                    showTextPopup(row.PermissionDescription);
                });
            })(r, i)
                button.off().on('click', function () {
                //get the checked permissions to the new role
                var selected = [];
                tableBody.find('input:checked').each(function () {
                    selected.push($(this).val());
                });                
                if (on_click_selected_required) on_click_selected_required(selected);
          });
        }
    });
}

function assignPermissionsToRolesApiCall(roleIds, permissionIds, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "assign-permissions-to-roles",
        type: 'POST',
        dataType: "json",
        data: {
            roleIds: roleIds,
            permissionIds: permissionIds,
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

function unassignPermissionsFromRolesApiCall(roleIds, permissionIds, success_callback) {
    showCustomLoadingMessage();
    $.ajax({
        url: authorization_api_url + "unassign-permissions-from-roles",
        type: 'POST',
        dataType: "json",
        data: {
            roleIds: roleIds,
            permissionIds: permissionIds,
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

