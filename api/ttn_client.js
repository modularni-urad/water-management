import axios from 'axios'
import _ from 'underscore'
import assert from 'assert'
import data from './data'
import points from './points'
const ttn = require('ttn')
const TTN_URL = 'http://eu.thethings.network:8084'
assert.ok(process.env.APP_ID, 'env.APP_ID not defined!')
assert.ok(process.env.APP_SECRET, 'env.APP_SECRET not defined!')
const APP_ID = process.env.APP_ID
const APP_SECRET = process.env.APP_SECRET

// https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html
export default function appStart (knex) {
  console.log(`connecting to ${APP_ID}`)

  async function onUplink (devID, payload) {
    _sendMetadata(payload)
    let dev = await points.get(APP_ID, devID, knex)
    if (!dev) {
      await _createDev(devID, knex)
      dev = await points.get(APP_ID, devID, knex)
    }
    data.create(dev, payload.payload_fields, null, payload.metadata.time, knex)
  }

  ttn.data(APP_ID, APP_SECRET)
    .then(client => {
      console.log('connected')
      client.on('uplink', onUplink)
    })
    .catch(err => {
      console.error(err)
    })
}

async function _createDev (devId, knex) {
  const url = `${TTN_URL}/applications/${APP_ID}/devices/${devId}`
  const opts = { headers: { Authorization: `Key ${APP_SECRET}` } }
  const res = await axios.get(url, opts)
  const data = {
    app_id: APP_ID,
    dev_id: res.data.dev_id,
    desc: res.data.description,
    lat: res.data.latitude,
    lng: res.data.longitude,
    alt: res.data.altitude || 0
  }
  return points.create(data, knex)
}

const METADATA_ENDPOINT = process.env.METADATA_ENDPOINT
const METADATA_TOKEN = process.env.METADATA_TOKEN

function _sendMetadata (payload) {
  if (!METADATA_ENDPOINT) return
  const metadata = _.pick(payload, ['app_id', 'dev_id'])
  metadata.time = payload.metadata.time
  metadata.metadata = JSON.stringify(_.omit(payload.metadata, 'time'))
  axios.post(METADATA_ENDPOINT, metadata, {
    timeout: 2000,
    headers: { Authentication: METADATA_TOKEN }
  }).catch(err => {
    console.error(`METADATA: ${METADATA_ENDPOINT}: ${err.toString()}`)
  })
}
