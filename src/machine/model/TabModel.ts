import BaseModel from "@/machine/core/BaseModel";

interface ITabItem {
  id: string
  title: string
  
}

class TabModel extends BaseModel {
  state() {
    return {
      tabs: [],
      tabIndex: ''
    }
  }

  config(opt: { tabs: Array<ITabItem>; current: string }) {
    if (opt.tabs) {
      this.set('tabs', opt.tabs)
    }
    if (opt.current) {
      this.set('current', opt.current)
    }
  }

  switch(current: String) {
    this.set('current', current)
  }

}

export default TabModel;