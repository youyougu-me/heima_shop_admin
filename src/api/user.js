import service from "@/utils/request";


/**
 * 获取用户列表
 */
export function GetUserList(data) {

  return service.request({
    method: "get",
    url: "/users/",
    params: data
  })
}

/**
 * 添加新用户
 */
export function AddUser(data) {

  return service.request({
    method: "post",
    url: "/users/",
    data: data
  })
}

/**
 * 改变用户状态
 */
export function ChangeUserStatus(data) {

  return service.request({
    method: "put",
    url: `users/${data.id}/state/${data.mg_state}`,
  })
}

/**
 * 删除用户
 */
export function DeleteUser(data) {

  return service.request({
    method: "delete",
    url: "/users/" + data,
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
 * 分配用户角色
 */
export function SetUserRole(urlParams, data) {
  //路径里面的是用户id
  return service.request({
    method: "put",
    url: "/users/" + urlParams + "/role",
    data: data
  })
}

/**
 * 获取当前编辑项的用户数据
 */
export function RequestCurrentEditData(id) {
  //路径里面的是用户id
  return service.request({
    method: "get",
    url: `/users/${id}`
  })
}


/**
 * 提交编辑用户
 */
export function SubmitEdittUser(urlParams,data) {
  return service.request({
    method: "put",
    url: `/users/${urlParams}`,
    data:data
  })
}




