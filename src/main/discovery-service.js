import dgram from 'dgram'

import ip from 'ip'

const PORT = 20105
const MULTICAST_ADDR = '233.255.255.255'

export default function createDiscoveryService () {
  const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true })
  socket.bind(PORT)

  socket.on('listening', () => {
    socket.addMembership(MULTICAST_ADDR)
    console.log(`Discovery service listening on ${MULTICAST_ADDR}:${PORT}`)
  })

  socket.on('message', (message, rinfo) => {
    try {
      message = message.toString()
      const data = JSON.parse(message)
      if (data.source !== 'lumos' || data.type !== 'discovery-search') {
        return
      }

      const responseStr = JSON.stringify({ source: 'lumos', type: 'discovery-response', version: 'x.x.x', addr: ip.address() })
      const response = Buffer.from(responseStr)
      socket.send(response, 0, response.length, PORT, MULTICAST_ADDR)
    } catch (err) {
      // do nothing
    }
  })
}
