"use strict";

var authorization_api_url = system_api_domain + "/kenticoapi/authorization/";

function showAllRolesApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: user_api_url + "/get-roles",
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
                        var tablebody2 = $('#permissionsOfRole-table');
                        createRolePermissionsTable(row2, tablebody2, "roleName-h1");
                    });
                })(row, i)
            }
            //$('#addRole-btn').off().on('click', function () {
            //    getRolesApiCall(function (response) {
            //        var formbody = $('#allRolesCheckbox-form');
            //        formbody.empty();
            //        for (var i = 0; i < response.roleList.length; i++) {
            //            var r = response.roleList[i];
            //            formbody.append(
            //               '<label for="allRolesCheckbox' + i + '">' + r.RoleName + '</label>' +
            //               '<input type="checkbox" name="allRoles" id="allRolesCheckbox' + i + '" value="' + r.RoleId + '">'
            //            );
            //        }
            //    });
            //});
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

function createRolePermissionsTable(role, tableBody, headerElement) {
    tableBody.empty();
    if (headerElement != null) {
        $('#' + headerElement).html(role.RoleDisplayName);
    }
    getRolePermissionsApiCall(role.RoleId, function (result) {
        var permissions = result.permissionList;
        for (var i = 0; i < permissions.length; i++) {
            tableBody.append(
                '<tr>' +
                    '<td class="td-first"><span class="permission-name">' + permissions[i].PermissionDisplayName +
                    " - " + permissions[i].PermissionDescription +
                    '</span></td>' +
                    '<td class="td-second">' +
                         '<a href="#removePermission-popup" data-rel="popup" id="removePermission' + i +
                         '-btn" class="pull-right ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-delete ui-btn-icon-notext ui-mini"></a><br>' +
                    '</td>' +
                '</tr>');
        }
    });
        //(function (index) {
        //    $('#removePermission' + index + '-btn').on('click', function () {
        //        $('#removePermissionYes-btn').off().on('click', function () {
        //            removeUsersFromRolesApiCall([username], [roles[index]], kentico_site_name, function (response) {
        //                roles.splice(index, 1);
        //                createUserRolesTable(username, roles, tableBody);
        //            });
        //        });
        //    });
        //})(i);
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
