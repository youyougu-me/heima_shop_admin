
import service from "@/utils/request";
/**
 * 获取用户可选权限列表(每个角色都相同)
 */
export function GetRightsList(data) {

    return service.request({
        method: "get",
        url: "/rights/list",
        data: data
    })
}


/**
 * 获取角色权限列表
 */
export function GetRoleList(data) {

    return service.request({
        method: "get",
        url: "/roles",
        data: data
    })
}

/**
 * 删除某个角色下的某个权限
 */
export function DeleteRoleRight(data) {

    return service.request({
        method: "delete",
        url: "/roles/" + data.roleId + "/rights/" + data.rightsId,
    })
}

/**
 * 获取所有可选的权限列表,每个角色都相同
 */
export function GetRightsTree(data) {

    return service.request({
        method: "get",
        url: "/rights/tree",
    })
}

/**
 * 设置角色的用户权限后,提交
 */
export function SubmitRightsTree(urlParams, data) {

    return service.request({
        method: "post",
        url: "roles/" + urlParams + "/rights",
        data: data
    })
}