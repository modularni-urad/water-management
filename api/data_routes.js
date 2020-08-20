import data from './data'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    data.list(req.query, knex).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  app.post('/:id',
    auth.requireMembership('waterman_data'),
    JSONBodyParser,
    (req, res, next) => {
      data.createManualy(req.params.id, req.body, auth.getUID(req), knex)
        .then(createdid => { res.json(createdid) })
        .catch(next)
    })

  return app
}
