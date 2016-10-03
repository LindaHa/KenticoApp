var authorization_api_url = system_api_domain + "/kenticoapi/authorization/";

function showRolesApiCall() {
    showCustomLoadingMessage();
    $.ajax({
        url: "/kenticoapi/users/all-roles",
        type: 'GET',
        success: function (response) {
            var tablebody = $('#showAllRoles-table');
            tablebody.empty();
            for (var i = 0; i < response.roleList.length; i++) {
                var r = response.roleList[i];
                tablebody.append(
                    '<tr>' +
					    '<td class="td-first">' + r.RoleName  + '</td>' +
                        '<td class="td-second">' +
						'<a id="viewRole' + i + '-btn" href="#viewRole-page" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-eye ui-btn-icon-left pull-right ui-mini">View</a><br>' +
                        '</td>'+
                        '<td class="td-second.special">' +
						'<a id="deleteRole' + i + '-btn" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-delete ui-btn-icon-notext pull-right ui-mini">Delete Role</a><br>' +
                        '</td>'+
                    '</tr>');
                (function (row, index) {
                    $('#viewRole' + index + '-btn').on('click', function () {
                        document.getElementById(permissionName-h2).innerHTML = row.RoleName;
                        var $tablebody2 = $('#permissionsOfRole-table');
                        $tablebody2.empty();
                        for (var j = 0; j < row.Permissions.length; j++) {
                            $tablebody2.append(
                                '<tr>' +
                                    '<td class="td-first"><span class="permission-name">' + row.permissionName[j] + '</span></td>' +
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

                        $('#addRole-btn').off().on('click', function(){
                            showRolesApiCall();
                        });
                        $('#addSelectedRoles-btn').off().on('click', function () {
                            var selected = [];
                            $('#allRolesCheckbox-form input:checked').each(function () {
                                selected.push($(this).val());
                            });
                        });

                    });
                })(r, i)

                );
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