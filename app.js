class DragAndDrop {
  constructor(layouts, items, wrapper) {
    this.wrapper = wrapper
    this.layouts = [...layouts]
    this.items = [...items]

    this.layoutBoudaries = []

    this.wrapperOffsets = []
    this.mousepressed = 0

    this.draggingItem = {
      item: null,
      index: 0,
      itemPosition: 0,
      startPosition: 0,
      endPosition: 0,
    }

    this.swappedItemIndex = 0

    this.wrapperOffsets.push(this.wrapper.offsetTop, this.wrapper.offsetTop+this.wrapper.clientHeight)

    this.items.forEach(item => {
      item.addEventListener('mousedown', (mouse) => this.dragStart(mouse, item))
      item.addEventListener('mousemove', (mouse) => this.dragMove(mouse))
      item.addEventListener('mouseup', (mouse) => this.dragEnd(mouse))
    })
    
    this.layouts.forEach((item, index) => {
      item.dataset.index = index+1
      item.style.setProperty('--top', `${item.offsetTop}px`)
      const boundaries = {top: item.offsetTop-20, bottom: item.offsetTop+item.offsetHeight-10}
      this.layoutBoudaries.push(boundaries)
    })
  }

  get difference () {
    return this.draggingItem.endPosition - this.draggingItem.startPosition
  }

  swapItems(currentLayout, swappingLayout) {
    const swappingItem = swappingLayout.querySelector('.dd-item')
    swappingLayout.appendChild(this.draggingItem.item)
    currentLayout.appendChild(swappingItem)
    this.draggingItem.index = this.swappedItemIndex
  }

  dragStart = (mouse, item) => {
    this.mousePressed = 1
    this.draggingItem.item = item
    this.draggingItem.index = this.swappedItemIndex = +item.parentNode.dataset.index
    this.draggingItem.itemPosition = item.parentNode.offsetTop
    this.draggingItem.item.classList.add('grabbing')
    this.draggingItem.startPosition = mouse.clientY
  }

  dragMove = (mouse) => {
    if (this.mousePressed !== 1) return
    this.draggingItem.endPosition = mouse.clientY
    const movedValue = this.draggingItem.itemPosition + this.difference
    this.draggingItem.item.style.setProperty('--top', `${movedValue}px`)

    const changingArray = this.layoutBoudaries.map((bounds, index) => (movedValue >= bounds.top && movedValue < bounds.bottom) && index+1)
    const indexToCange = +changingArray.filter(i => i).join('')
    if (indexToCange === 0) { this.dragPrevent() }

    if (indexToCange === this.swappedItemIndex) return
    this.swappedItemIndex = indexToCange
    const currentLayout = this.wrapper.querySelector(`[data-index="${this.draggingItem.index}"]`),
          swappingLayout = this.wrapper.querySelector(`[data-index="${this.swappedItemIndex}"]`)
    this.swapItems(currentLayout, swappingLayout)
  }

  dragPrevent = () => {
    this.mousePressed = 0
    this.draggingItem.item.classList.remove('grabbing')
    this.draggingItem.item.removeAttribute('style')
    
  }

  dragEnd = () => {
    this.dragPrevent()
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const dragWrapper = document.querySelector('.dd-wrapper')
  const itemLayouts = dragWrapper.querySelectorAll('.dd-layout')
  const draggableItems = dragWrapper.querySelectorAll('.dd-item')
  new DragAndDrop(itemLayouts, draggableItems, dragWrapper)
})