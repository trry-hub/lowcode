import DOMPurify from 'dompurify'

export default function installDirective(app: any):void {
  // 高亮内容
  app.directive('dompurify', (el: HTMLElement, binding: any) => {
    el.innerHTML = DOMPurify.sanitize(binding.value)
  })
}
