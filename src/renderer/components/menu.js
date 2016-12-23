import React from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import WifiInfo from './wifi-info'

class Menu extends React.Component {
  static defaultProps = {
    onClose: () => {}
  }

  render () {
    return (
      <div className='full-screen menu' style={this.props.style}>
        <div className='close-button' onClick={this.handleClose}>
          <img src='./img/icon-close.png' />
        </div>

        <div className='image-button'>
          <img src='./img/icon-wifi.png' />
          <span>Wifi</span>
        </div>
        <div className='image-button'>
          <img src='./img/icon-gallery.png' />
          <span>Images</span>
        </div>

        <WifiInfo />
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
