// 删除url中参数
export function delUrlParam(param: string): string {
    let obj = new window.URL(window.location.href)
    obj.searchParams.delete(param)
    return obj.href
}
