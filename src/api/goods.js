import service from "@/utils/request";

//商品分类========================================
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

//分类参数========================================
/**
 *获取某个分类所对应的参数列表
 */
export function GetParamsByCategoryId(urlParams, data) {
    return service.request({
        method: "get",
        url: "/categories/" + urlParams + "/attributes",
        params: {
            sel: data
        }
    })
}

/**
 *添加动态参数或者是静态属性
 */
export function AddcategoryParams(urlParams, data) {
    return service.request({
        method: "post",
        url: `categories/${urlParams}/attributes`,
        data: data
    })
}


/**
 *修改的时候根据id查询参数
 */
export function GetcategoryParamsById(urlParams, data) {
    return service.request({
        method: "get",
        url: `categories/${urlParams.categoryId}/attributes/${urlParams.attrId}`,
        params: data
    })
}

/**
 *修改某个三级分类的时候的对应的提交
 */
export function SubmitcategoryParamsByUpdate(urlParams, data) {
    return service.request({
        method: "put",
        url: `categories/${urlParams.categoryId}/attributes/${urlParams.attrId}`,
        data: data
    })
}

/**
 *修改某个三级分类对应的动态参数或者静态属性
 */
export function DeleteCategoryToParams(urlParams, data) {
    return service.request({
        method: "delete",
        url: `categories/${urlParams.categoryId}/attributes/${urlParams.attrId}`,
        data: data
    })
}

/**
 *增加三级分类所对应  的某个参数的 扩展项的 标签属性
 */
export function AddCategorytoExpandToTag(urlParams, data) {
    return service.request({
        method: "put",
        url: `categories/${urlParams.categoryId}/attributes/${urlParams.attrId}`,
        data: data
    })
}




