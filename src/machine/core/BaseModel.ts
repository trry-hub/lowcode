import { defineStore } from 'pinia';

import debug from './debug';

interface IBaseModel {
  state(): void;
}


class BaseModel implements IBaseModel {

  data: any = {}
  private store: any;

  log: any;

  // state hook
  state(): any {
    return this.data
  }

  constructor(props?: { key: string; id: string }) {
    const _key = `${props?.id || '_'}.Model.${props?.key}`;
    const _store = defineStore(_key, {
      state: () => ({ data: this.state() || {} }),
      actions: {
        get(path: string) {
          return sget(this.data, path)
        },
        set(path: string, value: any) {
          return sset(this.data, path, value)
        }
      }
    })
    this.store = _store()
    this.log = debug(_key)
    this.log('model create');
  }

  get(key: string) {
    this.log('GET:', key)
    return this.store.get(key)
  }

  set(key: string, value: any) {
    this.log('SET:', key, value)
    this.store.set(key, value)
  }

}

export default BaseModel;


export function sget(data: any, path: string) {
  if (typeof path === 'string') {
    if (path.length === 0) {
      return data;
    }
    let temp = data;
    if (path.indexOf('.') > -1) {
      const m = path.split('.')
      for(let i = 0; i < m.length; i++) {
        if (temp[m[i]] !== undefined) {
          temp = temp[m[i]]
        } else {
          return undefined
        }
      }
      return temp
    }
    return data[path]
  }

  return undefined
}


export function sset(data: any, path: string, value: any) {
  if (typeof path === 'string') {
    if (path.length === 0) {
      return false;
    }
    let temp = data;
    if (path.indexOf('.') > -1) {
      const m = path.split('.')
      const len = m.length - 1
      for(let i = 0; i < len; i++) {
        const k = m[i]
        if (temp[k] === undefined) {
          temp[k] = {}
        }
        temp = temp[k]
      }
      temp[m[len]] = value;
    } else {
      data[path] = value
    }
    return true
  }

  return false
}

