import React from 'react'
import ReactDom from 'react-dom'

class App extends React.Component {
  render () {
    return (
      <div>
        Hello!
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('app'))
