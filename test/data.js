/* global describe it */
const chai = require('chai')
// const should = chai.should()
// import _ from 'underscore'
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
      batt: 3.54
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
  })
}