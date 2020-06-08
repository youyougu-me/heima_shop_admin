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
 * 删除用户
 */
export function DeleteUser(data) {

  return service.request({
    method: "delete",
    url: "/users/" + data,
  })
}




