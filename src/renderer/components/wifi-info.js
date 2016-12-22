import React from 'react'
import { connect } from 'react-redux'

class WifiInfo extends React.Component {
  render () {
    return (
      <div className='wifi-info'>
        {this.props.ssid ? this.props.ssid : ''}
      </div>
    )
  }
}

export default connect(state => ({
  connected: state.wifi.connected,
  ssid: state.wifi.ssid
}))(WifiInfo)
