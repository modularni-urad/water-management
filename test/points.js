/* global describe it */
const chai = require('chai')
chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const p1 = {
    app_id: 'app1',
    dev_id: 'p1',
    coef: 1 / 1000,
    start: 512,
    desc: 'pok1 with device',
    sn: '43242',
    type: 'std'
  }

  return describe('points', () => {
    it('must not create a new item wihout approp group', async () => {
      const res = await r.post('/points').send(p1)
      res.status.should.equal(403)
    })

    it('shall create a new item p1', async () => {
      g.usergroups.push('waterman_admin')
      const res = await r.post('/points').send(p1)
      res.status.should.equal(201)
    })

    // it('shall update the item pok1', () => {
    //   const change = {
    //     name: 'pok1changed'
    //   }
    //   return r.put(`/tasks/${p.id}`).send(change)
    //   .set('Authorization', g.gimliToken)
    //   .then(res => {
    //     res.should.have.status(200)
    //   })
    // })

    it('shall get the pok1', async () => {
      const res = await r.get('/points')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].coef.should.equal(p1.coef)
    })
  })
}
