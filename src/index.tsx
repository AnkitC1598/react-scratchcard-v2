import React, { Component } from 'react'

type Point = {
  x: number
  y: number
}

interface Props {
  width: number
  height: number
  image: any
  finishPercent: number
  onComplete: () => void
  children: any
}

interface State {
  loaded: boolean
  finished: boolean
}

class Scratch extends Component<Props, State> {
  isDrawing = false

  lastPoint: Point | null = null

  ctx?: any

  canvas!: HTMLCanvasElement

  constructor(props: Props) {
    super(props)
    this.state = { loaded: false, finished: false }
  }

  componentDidMount() {
    this.isDrawing = false
    this.lastPoint = null
    this.ctx = this.canvas.getContext('2d')

    const image = new Image()
    image.crossOrigin = 'Anonymous'
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, this.props.width, this.props.height)
      this.setState({ loaded: true })
    }

    image.src = this.props.image
  }

  getFilledInPixels(stride: number) {
    if (!stride || stride < 1) {
      stride = 1
    }

    const pixels = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
    const total = pixels.data.length / stride
    let count = 0

    for (let i = 0; i < pixels.data.length; i += stride) {
      if (parseInt(pixels.data[i], 10) === 0) {
        count++
      }
    }

    return Math.round((count / total) * 100)
  }

  getMouse(e: any, canvas: HTMLCanvasElement) {
    const { top, left } = canvas.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    let x = 0
    let y = 0

    if (e && e.pageX && e.pageY) {
      x = e.pageX - left - scrollLeft
      y = e.pageY - top - scrollTop
    } else if (e && e.touches) {
      x = e.touches[0].clientX - left - scrollLeft
      y = e.touches[0].clientY - top - scrollTop
    }

    return { x, y }
  }

  distanceBetween(point1: Point | null, point2: Point | null) {
    if (point1 && point2) {
      return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
      )
    }

    return 0
  }

  angleBetween(point1: Point | null, point2: Point | null) {
    if (point1 && point2) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y)
    }
    return 0
  }

  handlePercentage(filledInPixels = 0) {
    if (filledInPixels > this.props.finishPercent) {
      this.canvas.style.transition = '1s'
      this.canvas.style.opacity = '0'
      this.setState({ finished: true })
      if (this.props.onComplete) {
        this.props.onComplete()
      }
    }
  }

  handleMouseDown = (e: any) => {
    this.isDrawing = true
    this.lastPoint = this.getMouse(e, this.canvas)
  }

  handleMouseMove = (e: any) => {
    if (!this.isDrawing) {
      return
    }

    e.preventDefault()

    const currentPoint = this.getMouse(e, this.canvas)
    const distance = this.distanceBetween(this.lastPoint, currentPoint)
    const angle = this.angleBetween(this.lastPoint, currentPoint)

    let x, y

    for (let i = 0; i < distance; i++) {
      x = this.lastPoint ? this.lastPoint.x + Math.sin(angle) * i : 0
      y = this.lastPoint ? this.lastPoint.y + Math.cos(angle) * i : 0
      this.ctx.globalCompositeOperation = 'destination-out'
      this.ctx.beginPath()
      this.ctx.arc(x, y, 15, 0, 2 * Math.PI, false)
      this.ctx.fill()
    }

    this.lastPoint = currentPoint
    this.handlePercentage(this.getFilledInPixels(32))
  }

  handleMouseUp = () => {
    this.isDrawing = false
  }

  render() {
    const containerStyle = {
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      position: 'relative' as const,
      WebkitUserSelect: 'none' as const,
      MozUserSelect: 'none' as const,
      msUserSelect: 'none' as const,
      userSelect: 'none' as const
    }

    const canvasStyle = {
      position: 'absolute' as const,
      top: 0,
      zIndex: 1
    }

    const resultStyle = {
      visibility: this.state.loaded
        ? ('visible' as const)
        : ('hidden' as const),
      width: '100%',
      height: '100%'
    }

    return (
      <div className='ScratchCard__Container' style={containerStyle}>
        <canvas
          ref={(ref: any) => {
            this.canvas = ref
          }}
          className='ScratchCard__Canvas'
          style={canvasStyle}
          width={this.props.width}
          height={this.props.height}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onTouchMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onTouchEnd={this.handleMouseUp}
        />
        <div className='ScratchCard__Result' style={resultStyle}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Scratch
