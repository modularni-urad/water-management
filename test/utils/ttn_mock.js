import events from 'events'
import express from 'express'

export const ttnClient = new events.EventEmitter()
export function setTTNData (data) { ttnData = data }
let ttnData = {}

const app = express()
app.get((req, res) => {
  res.json(ttnData)
})
app.listen(9000)
