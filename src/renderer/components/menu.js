import React from 'react'
import { TransitionMotion, spring } from 'react-motion'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import WifiInfo from './wifi-info'

const PAGES = {
  DEFAULT: "DEFAULT",
  WIFI: "WIFI",
  IMAGES: "IMAGES"
}

class Menu extends React.Component {
  static defaultProps = {
    onClose: () => {}
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      page: PAGES.DEFAULT
    }
  }

  willEnter () {
    return {opacity: -1}
  }

  willLeave () {
    return {opacity: spring(-1)}
  }

  render () {
    return (
      <TransitionMotion
        willEnter={this.willEnter}
        willLeave={this.willLeave}
        styles={
          [{
            key: this.state.page,
            data: this.renderPage(this.state.page),
            style: {opacity: spring(1)}
          }]
        }
      >
        {interpolatedStyles => {
          return (
            <div className='full-screen menu' style={this.props.style}>
              {interpolatedStyles.map(({key, data, style}) => (
                React.cloneElement(data, {style: {opacity: Math.max(style.opacity, 0)}})
              ))}

              <div className='close-button' onClick={this.handleClose}>
                <img src='./img/icon-close.png' />
              </div>

              <WifiInfo />
            </div>
          )
        }}
      </TransitionMotion>
    )
  }

  renderPage (page) {
    switch (page) {
      case PAGES.WIFI:
        return this.renderWifi()
      case PAGES.IMAGES:
        return this.renderImages()
      default:
        return this.renderDefault()
    }
  }

  renderDefault () {
    return (
      <div className='full-screen-floating' key='default'>
        <div className='image-button' onClick={() => this.changePage(PAGES.WIFI)}>
          <img src='./img/icon-wifi.png' />
          <span>Wifi</span>
        </div>
        <div className='image-button' onClick={() => this.changePage(PAGES.IMAGES)}>
          <img src='./img/icon-gallery.png' />
          <span>Images</span>
        </div>
      </div>
    )
  }

  renderWifi () {
    return (
      <div className='full-screen-floating' key='wifi' onClick={() => this.changePage(PAGES.DEFAULT)}>
        <span>Wifi</span>
      </div>
    )
  }

  renderImages () {
    return (
      <div className='full-screen-floating' key='images' onClick={() => this.changePage(PAGES.DEFAULT)}>
        <span>Images</span>
      </div>
    )
  }

  orender () {
    return (
      <div className='full-screen menu' style={this.props.style}>
        <span className='close-button' onClick={this.handleClose}>
          &times;
        </span>
        <h1>Wifi</h1>
        <div>{this.renderWifiInfo()}</div>
        <h1>Photos</h1>
        <WifiInfo />
      </div>
    )
  }

  renderWifiInfo () {
    let info
    if (this.props.wifi.connected) {
      info = <span>Connected to: {this.props.wifi.ssid}</span>
    } else if (this.props.wifi.connecting) {
      info = <span>Connecting...</span>
    } else {
      info = <span>Not connected</span>
    }

    return (
      <div className='section'>
        {info}
      </div>
    )
  }

  changePage (page) {
    this.setState({page: page})
  }

  @autobind
  handleClose (e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.onClose()
  }
}

export default connect(state => ({
  wifi: {
    connected: state.wifi.connected,
    connecting: state.wifi.connecting,
    ssid: state.wifi.ssid,
    scanning: state.wifi.scanning,
    availableSsids: state.wifi.availableSsids
  }
}))(Menu)
