import service from "@/utils/request";


/**
 * 获取订单列表
 */
export function GetOrderList(data) {
  //当前页码和pagesize不能为空
  return service.request({
    method: "get",
    url: "/orders/",
    params: data
  })
}


/**
 * 查看物流信息
 */
// 供测试的id单号804909574412544580
export function CheckLogisticsInfo(urlParams) {
  return service.request({
    method: "get",
    url: "/kuaidi/" + urlParams
  })
}


export const logisticsInfo = [
  {
    time: "2018-05-10 09:39:00",
    context: "已签收,感谢使用顺丰,期待再次为您服务"
  },
  {
    time: "2018-05-10 08:23:00",
    context: "[北京市]北京海淀雨欣小区营业点派件员 顺丰速运 95338正在为您派件"
  },
  {
    time: "2018-05-10 07:32:00",
    context: "快件到达[北京海淀雨欣小区营业点]"
  },
  {
    time: "2018-05-9 13:23:00",
    context: "快件到达[北京海淀中转中心]"
  }
]



