
// import Debug from 'debug';

/* global window */

const filter = window.localStorage.debug || ''
const enable = !!filter

let count = 0

const colors = [
    'lightseagreen',
    'forestgreen',
    'goldenrod',
    'dodgerblue',
    'darkorchid',
    'crimson',
]
const hold: any = {}

const log = window.console.log || function () { }

const start = new Date()

let time = start

let regs: any

function check_filter() {
    const split = filter.split(/[\s,]+/)
    const len = split.length

    const skips = []
    const names = []

    for (let i = 0; i < len; i++) {
        if (!split[i]) continue // ignore empty strings
        const n = split[i].replace(/\*/g, '.*?')
        if (n[0] === '-') {
            skips.push(new RegExp(`^${n.substr(1)}$`))
        } else {
            names.push(new RegExp(`^${n}$`))
        }
    }

    regs = {
        skips,
        names,
    }
}

function check_show(name: any) {
    const skips = regs.skips
    const names = regs.names

    let i
    let len
    for (i = 0, len = skips.length; i < len; i++) {
        if (skips[i].test(name)) {
            return false
        }
    }
    for (i = 0, len = names.length; i < len; i++) {
        if (names[i].test(name)) {
            return true
        }
    }
    return false
}

function debug(name: string) {
    const key = `%c${name}`
    let c = hold[name] || null
    if (!c) {
        const i = count % colors.length
        c = `color:${colors[i]}`
        count++
        hold[name] = c
    }

    let show = true
    if (filter) {
        if (regs === undefined) {
            check_filter()
        }
        show = check_show(name)
    }

    function logger(first: any, ...arg: any) {
        if (enable && show) {
            const t = new Date()
            let d = t.getTime() - time.getTime()
            let e = 'ms'
            if (d > 1000) {
                d = Math.round(d / 1000)
                e = 's'
            }
            const m = d + e
            time = t
            return log(key, c, first, ...arg, m)
        }
    }
    return logger
}

export default debug
