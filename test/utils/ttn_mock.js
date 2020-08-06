import events from 'events'
import express from 'express'
import bodyParser from 'body-parser'

export const ttnClient = new events.EventEmitter()
export function setTTNData (data) { ttnData = data }
let ttnData = {}
export const integratorData = []

const app = express()
app.get('*', (req, res) => {
  res.json(ttnData)
})
app.post('/task', bodyParser.json(), (req, res) => {
  integratorData.push(req.body)
  res.send('ok')
})
app.listen(9000)
