import initPointRoutes from './api/point_routes'
import initDataRoutes from './api/data_routes'

export default (ctx) => {
  const app = ctx.express()

  app.use('/points', initPointRoutes(ctx))
  app.use('/data', initDataRoutes(ctx))

  return app
}
