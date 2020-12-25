// Get List Department from API and create Tree or Add Child Node
function getListDept(parentID = 0, parentNode = null) {
    //let paramParentId = parentID == -1 ? '' : `&id_cha=${parentID}`; // -1 - ID root (vien thong tinh)
    $.ajax({
        url: `${rootUrl}/api/phongban?idcha=${parentID}`,
        success: function (data, textStatus, xhr) {
            const resStatus = xhr.status;
            switch (resStatus) {
                case 200:
                    // handle Info from API
                    let dataJson = [];
                    data.forEach(item => {
                        const objNode = {
                            id: item.id,
                            text: item.ten,
                            state: {
                                opened: true
                            },
                        };
                        dataJson.push(objNode);
                        if (parentNode) {
                            $("#jstree_demo").jstree('create_node', parentNode, objNode, 'last');
                        }
                    })

                    if (parentID == 0) {
                        createTree(dataJson);
                    }
                    break;
                case 401:
                    new PNotify.alert({
                        title: 'Failed !!!',
                        text: `Lỗi !!! Vui lòng đăng nhập lại`,
                        type: 'error'
                    });
                    break;
                default:
                    new PNotify.alert({
                        title: 'Failed !!!',
                        text: `Lỗi !!! Thử lại hoặc liên hệ admin để được hỗ trợ`,
                        type: 'error'
                    });
                    break;
            }
        },
        error: function (e) {
            new PNotify.alert({
                title: 'Failed !!!',
                text: `${e}`,
                type: 'error'
            });
        }
    });
}

// Push data and draw JStree
function createTree(dataJson) {
    $('#jstree_demo').jstree({

        "core": {                    // core config object
            "mulitple": false,         // disallow multiple selection
            "animation": 100,          // 200ms is default value
            "check_callback": true,   // this make contextmenu plugin to work
            "themes": {
                "variant": "medium",
                "dots": false
            },
            "data": dataJson
        }, // core end

        // Types plugin
        "types": {
            "default": {
                "icon": "feather icon-server"
            },
            "demo": {
                "icon": "feather icon-home"
            }
        },
        "conditionalselect": function (node, event) {
            return false;
        },

        // injecting plugins
        "plugins": [
            //"checkbox",
            //"contextmenu",
            // "dnd",
            // "massload",
            // "search",
            // "sort",
            // "state",
            "types",
            // Unique plugin has no options, it just prevents renaming and moving nodes
            // to a parent, which already contains a node with the same name.
            "unique",
            // "wholerow",
            // "conditionalselect",
            "changed"
        ]
    });
}

function getListUser(IdDept, tableTD) {
    $.ajax({
        url: `${rootUrl}/api/nguoidung?idphongban=${IdDept}`,
        success: function (data, textStatus, xhr) {
            const resStatus = xhr.status;
            switch (resStatus) {
                case 200:
                    // handle Info from API
                    const dataResult = [];
                    const groupRoles = JSON.parse(sessionStorage.getItem('groupRoles'));

                    for (let [index, item] of data.entries()) {
                        let optionAll = '';
                        const nhomQuyenID = item.nhomQuyen ? item.nhomQuyen.id : 0;
                        groupRoles.forEach(role => {
                            optionAll += `<option value="${role.id}" ${role.id == nhomQuyenID ? 'selected' : ''}>
                                                    ${role.ten}
                                                </option>`
                        })

                        const dataSelect = `<td>
                                            <select class="form-control roles-select" data-userid="${item.id}">
                                                ${optionAll}
                                            </select>
                                        </td>`
                        dataResult.push({
                            "STT": ++index,
                            "TEN_ND": item.hoTen,
                            "TEN_QUYEN": dataSelect
                        });
                    }

                    drawTable(tableTD, dataResult);

                    new PNotify.alert({
                        title: 'Success !!!',
                        text: 'Tác vụ hoàn tất',
                        type: 'success'
                    });
                    break;
                case 401:
                    new PNotify.alert({
                        title: 'Failed !!!',
                        text: `Lỗi !!! Vui lòng đăng nhập lại`,
                        type: 'error'
                    });
                    break;
                default:
                    new PNotify.alert({
                        title: 'Failed !!!',
                        text: `Lỗi !!! Thử lại hoặc liên hệ admin để được hỗ trợ`,
                        type: 'error'
                    });
                    break;
            }
        },
        error: function (e) {
            alert('Có lỗi xảy ra !!!');
            new PNotify.alert({
                title: 'Failed !!!',
                text: `${e}`,
                type: 'error'
            });
        }
    });
}

function drawTable(tableTD, data) {
    tableTD.clear();
    tableTD.rows.add(data);
    tableTD.draw();
}

function saveUserRoleDB(userID, roleID) {
    $.ajax({
        url: `${rootUrl}/api/quyen`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            "NhomQuyenID": parseInt(roleID),
            "NguoiDungID": parseInt(userID),
        }),
        success: function (data, textStatus, xhr) {
            const resStatus = xhr.status;
            switch (resStatus) {
                case 200:
                    // handle Info from API
                    new PNotify.alert({
                        title: 'Success !!!',
                        text: 'Tác vụ hoàn tất',
                        type: 'success'
                    });
                    break;
                case 401:
                    new PNotify.alert({
                        title: 'Failed !!!',
                        text: `Lỗi !!! Vui lòng đăng nhập lại`,
                        type: 'error'
                    });
                    break;
                default:
                    new PNotify.alert({
                        title: 'Failed !!!',
                        text: `Lỗi !!! Thử lại hoặc liên hệ admin để được hỗ trợ`,
                        type: 'error'
                    });
                    break;
            }
        },
        error: function (e) {
            new PNotify.alert({
                title: 'Failed !!!',
                text: `Lỗi !!! Thử lại hoặc liên hệ admin để được hỗ trợ`,
                type: 'error'
            });
        }
    });
}