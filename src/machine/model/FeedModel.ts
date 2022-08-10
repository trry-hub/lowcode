import BaseModel from "@/machine/core/BaseModel";

class FeedModel extends BaseModel {

  state() {
    return {
      
    }
  }

  config(options: any) {
    const { key, param, hook } = options;

    if (typeof key === 'string') {
      this.set(key, {
        param: param,
        hook: hook,
        feeds: [],
      })
    }
  }

  async fetch(key: string, pageIndex: number = 0, extra?: any) {
    this.log('FETCH:', key, pageIndex, extra || {})

    // check if has feed cache
    const target = this.get(key)

    if (!target) {
      return null
    }

    const { feeds } = target

    // has cache
    let feed = feeds[pageIndex]

    // check feed
    if (!feed) {
      // create feed
      feeds[pageIndex] = {
        status: 0,
        list: [],
        hasMore: false,
        pager: {
          pageIndex: pageIndex,
          pageSize: 10,
        },
      }
      feed = feeds[pageIndex]
    }

    // ready
    if (feed.status === 2 || feed.status === 3) {
      return feed
    }

    // loading
    if (feed.status === 1) {
      if (feed.__fetch_promise) {
        await feed.__fetch_promise
        return feed
      }
    }

    // error for retry

    // wait
    if (feed.status === 0 || feed.status === 4) {
      // set status to loading
      feed.status = 1
      const hook = target.hook;
      const param = target.param;
      if (hook) {
        feed.__fetch_promise = hook({ ...param, pageIndex });
        const res = await feed.__fetch_promise
        const { success, list = [], hasMore, extra } = res;
        if (success) {
          if (list.length > 0) {
            feed.status = 2
            feed.list = list
            feed.hasMore = !!hasMore
            feed.extra = extra
          }
        } else {
          feed.status = 4
        }
        return feed
      }
    }
  }

  clear(key: string) {
    const target = this.get(key)
    if (target) {
      target.feeds = []
    }
  }

}

export default FeedModel;