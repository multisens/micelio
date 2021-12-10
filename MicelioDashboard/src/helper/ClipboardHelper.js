export default class ClipboardHelper {
  copy($element) {
    navigator.clipboard.writeText($element?.getAttribute("data-copy"))
  }
}
