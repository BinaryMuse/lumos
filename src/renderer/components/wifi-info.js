import React from 'react'
import { connect } from 'react-redux'

class WifiInfo extends React.Component {
  render () {
    let icon, ssid
    if (this.props.ssid) {
      icon = <img src='./img/icon-wifi.png' className='tiny-wifi' />
      ssid = this.props.ssid
    }
    return (
      <div className='wifi-info'>
        {icon} {ssid}
      </div>
    )
  }
}

export default connect(state => ({
  connected: state.wifi.connected,
  ssid: state.wifi.ssid
}))(WifiInfo)
