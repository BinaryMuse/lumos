import React from 'react'

export default function FullScreen ({ style, children, ...props }) {
  const newStyle = { ...style, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
  return <div {...props} style={newStyle}>{children}</div>
}
