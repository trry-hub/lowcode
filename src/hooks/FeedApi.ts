
function sleep (d = 200) {
  return new Promise((s) => setTimeout(s, d || 200))
}

export async function FetchVoteList(param: any) {
  await sleep(500)
  const { id, pageIndex } = param;
  const count = parseInt(`${Math.random() * 6}`, 10) + 1
  const list = [
    { index: 1, pid: id, },
    { index: 2, pid: id, },
    { index: 3, pid: id, },
    { index: 4, pid: id, },
    { index: 5, pid: id, },
    { index: 6, pid: id, },
    { index: 7, pid: id, },
    { index: 8, pid: id, },
    { index: 9, pid: id, },
    { index: 10, pid: id, },
  ]
  return {
    success: count > 2,
    list: list.slice(0, count),
    hasMore: pageIndex < 5,
  }
}