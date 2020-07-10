import points from './points'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    points.list(req.query, knex).then(info => { res.json(info) }).catch(next)
  })

  app.post('/', auth.required, JSONBodyParser, (req, res, next) => {
    points.create(req.body, knex).then(savedid => {
      res.status(201).json(savedid)
      next()
    }).catch(next)
  })

  app.put('/:id([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    points.update(req.params.id, req.body, knex)
      .then(result => res.json(result))
      .catch(next)
  })

  return app
}
