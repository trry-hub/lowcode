
import { defineStore, type Store } from 'pinia'
import debug from './debug'

class Machine {
  version = '1.0.0'

  // pinia store
  private store: any

  private __DSL

  // model
  private __modelVos: any = {}

  // action
  private __actionVos: any = {}

  // layer
  private __layerVos: any = {}

  // nodes
  nodes: any = []

  log: any = {}

  constructor(config?: any, payload?: any, options?: any) {
    // 初始化 数据
    this.__DSL = config
    this.init()
  }

  async init() {
    const {

      models = [],
      layers = [],
      states = [],
      frames = [],
      actions = [],

      init: initActions = [],

      id = 'machine',
    } = this.__DSL

    // log
    this.log.system = debug(`${id}.System`)
    this.log.action = debug(`${id}.Action`)

    // init
    this.log.system('init system')

    // layer
    this.__layerVos = reduceToViewMap(layers)

    // action
    this.__actionVos = reduceToHookMap(actions)

    // nodes
    this.nodes = reduceFrameToNode(frames, this.__layerVos)

    // make model with key
    const modelVos: any = {}
    models.forEach((e: any) => {
      const { key, hook } = e
      modelVos[key] = new hook({ key: key, id: id })
    })
    this.__modelVos = modelVos

    this.log.system('init state')
    // make default stateVos
    const stateVos: any = {}
    for (let i = 0; i < states.length; i++) {
      const state = states[i]
      stateVos[state.key] = state.value || 'DEFAULT'
    }

    // make default layerDataVos
    const initLayerDataVos: any = {}

    // 初始化 state
    const __store = defineStore(id, {
      state: () => {
        return {
          // 状态机 vos
          stateVos,

          // 图层数据 layerDataVos
          layerDataVos: initLayerDataVos,
          __updateTime: new Date().getTime()
        }
      },

      getters: {

      },

      // 事件
      actions: {
        // 重新计算数据
        update(stateVos: any) {
          this.stateVos = stateVos
          this.__updateTime = new Date().getTime()
        },

        async initLayerData(layer: any) {
          const { path, data } = layer || {}

          // init layer data once
          if (data && !this.layerDataVos[path]) {
            let staticVos: any = {}
            let getterVos: any = {}
            const datas = Object.keys(data)
            let log = debug(`${id}.Data.${path}`)
            // make context
            const ctx = {
              model: (name: string) => modelVos[name],
              get: (path: string) => {
                const hook = getterVos[path]
                return hook ? hook() : undefined
              },
              log,
            }
            log('create layer data')
            // make layer store getter / static
            for (let i = 0; i < datas.length; i++) {
              const key = datas[i]
              // is function
              const dataHook = data[key]
              if (typeof dataHook === 'function') {
                getterVos[key] = () => dataHook(ctx)
              } else {
                staticVos[key] = dataHook
              }
            }
            const _dataStore = defineStore(`layer.${path}`, {
              state: () => staticVos,
              getters: getterVos,
            })

            const dataStore = _dataStore()

            // TODO: observe dataStore

            // make dataVos a relative store
            this.layerDataVos[path] = dataStore
          }
        },
      },
    })

    this.store = __store()

    this.log.system('run initActions')

    // make action context
    const ctx = {
      // model
      model: (name: string) => this.__modelVos[name],
      invoke: (action: string, payload: any) => {
        return this.invoke(action, payload)
      },
      payload: {},
    }
    // do initActions
    for (let i = 0; i < initActions.length; i++) {
      const { hook } = initActions[i]
      if (hook) {
        await hook(ctx)
      }
    }

    this.state()
  }

  // 状态机
  async state() {
    this.log.system('run state')
    const {
      states = [],
    } = this.__DSL

    const stateVos: any = {}
    for (let i = 0; i < states.length; i++) {
      const state = states[i]
      const ctx = {
        model: (name: string) => {
          const model = this.__modelVos[name]
          return model
        },
      }
      const { key: stateKey, hook } = state
      if (hook) {
        const stateValue = await hook(ctx)
        stateVos[stateKey] = stateValue
      }
    }
    this.store.update(stateVos)
  }

  async update() {
    // 运行 状态机
    this.state()
  }

  async invoke(actionName: string, payload: any) {
    const hook = this.__actionVos[actionName]
    if (hook) {
      const ctx = {
        model: (name: string) => {
          const model = this.__modelVos[name]
          return model
        },
        log: this.log.action,
        update: () => this.update(),
        invoke: (action: string, payload: any) => this.invoke(action, payload),
        payload: payload || {},
      }
      this.log.action(actionName, payload)
      return await hook(ctx)
    }
  }
}

export default Machine

function reduceFrameToNode(frames = [], layerVos: any = {}) {
  // 解析 所有 frame 中的 block 解析成 需要渲染的节点；
  const res: any = []

  function toVos (list: any, path: string, childrenMapVos: any) {
    const map: any = {}
    list.forEach((o: any) => {
      const { layer, value } = o
      const item = layerVos[layer] || {}
      const pid = `${path}:${value}`;
      if (item) {
        const block = {
          // 这里的path 关联 store 中的数据索引
          path: pid,
          view: item.view,
          data: item.data,
          children: [],
        }
        // reduce children
        if (childrenMapVos[pid]) {
          block.children = reduceFrameToNode(childrenMapVos[pid], layerVos)
        }
        map[value] = block;
      }
    })
    return map
  }

  frames.forEach((f, index) => {
    const { blocks = [], key, children = [] } = f

    // reduce sub frame
    const childrenMapVos: any = {}

    if (children.length > 0) {
      children.forEach(subFrame => {
        const { bindState } = subFrame
        const id = `${key}.${bindState}`
        if (!childrenMapVos[id]) {
          childrenMapVos[id] = []
        }
        childrenMapVos[id].push(subFrame);
      })
    }

    blocks.forEach((o) => {
      const { state, stateMaps = [] } = o
      const block = {
        state,
        stateMapVos: toVos(stateMaps, `${key}.${state}`, childrenMapVos),
      }
      res.push(block)
    })
  })
  return res
}

function reduceToViewMap(list = []) {
  const map: any = {}
  list.forEach(e => {
    const { key, view, data } = e
    map[key] = {
      view,
      data,
    }
  })
  return map
}

function reduceToHookMap(list = []) {
  const map = {}
  list.forEach(e => {
    const { key, hook } = e
    map[key] = hook
  })
  return map
}
