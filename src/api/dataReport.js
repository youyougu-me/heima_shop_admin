import service from "@/utils/request";

/**
 * 获取基于时间统计的折线图数据
 */
export function GetEchartDataReports(data) {

    return service.request({
        method: "get",
        url: "/reports/type/1",
        params: data
    })
}