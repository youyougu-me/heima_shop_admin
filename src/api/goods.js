import service from "@/utils/request";


/**
 * 获取商品分类
 */
export function GetGoodsCategory(data) {

    return service.request({
        method: "get",
        url: "/categories/",
        params: data
    })
}

/**
 * 添加商品分类
 */
export function AddGoodsCategory(data) {

    return service.request({
        method: "post",
        url: "/categories/",
        data: data
    })
}
