/* global describe it */
const chai = require('chai')
// const should = chai.should()
import deepcopy from 'deepcopy'
const wait = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const data = {
    app_id: 'app1',
    dev_id: 'p1',
    payload_fields: {
      wter: 983436,
      batt: 3.54,
      temp: 23
    },
    metadata: {
      time: '2020-05-27T11:45:15.141140285Z'
    }
  }
  const dev = {
    app_id: 'app1',
    dev_id: 'p1',
    latitude: 123
  }

  return describe('data', () => {
    it('data through TTN', async () => {
      g.setTTNData(dev)
      g.ttnClient.emit('uplink', data.dev_id, data)
      await wait(1800)
      const res = await r.get('/data/')
      res.should.have.status(200)
    })

    it('must create a new data', async () => {
      const res = await r.post(`/data/${1}`).send({ value: 1144 })
      res.should.have.status(200)
    })

    it('batt low alert', async () => {
      g.setTTNData(dev)
      const lowbattData = deepcopy(data)
      lowbattData.payload_fields.batt = 1
      lowbattData.metadata.time = (new Date()).toISOString()
      g.ttnClient.emit('uplink', lowbattData.dev_id, lowbattData)
      await wait(1800)
      const res = await r.get('/points/').query({ dev_id: lowbattData.dev_id })
      res.should.have.status(200)
      res.body[0].alerts.should.equal('lowbatt')
      g.integratorData.length.should.equal(1)
    })

    it('batt low alert not repeat', async () => {
      g.integratorData.splice(0, g.integratorData.length)
      const lowbattData = deepcopy(data)
      lowbattData.payload_fields.batt = 1
      lowbattData.metadata.time = (new Date()).toISOString()
      g.ttnClient.emit('uplink', lowbattData.dev_id, lowbattData)
      await wait(1800)
      g.integratorData.length.should.equal(0)
    })
  })
}
