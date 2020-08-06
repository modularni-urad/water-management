import { TNAMES } from '../consts'
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'

export default { create, update, list, get }

function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || null
  const fields = query.fields ? query.fields.split(',') : null
  const sort = query.sort ? query.sort.split(':') : null
  const filter = query.filter ? JSON.parse(query.filter) : null
  let qb = knex(TNAMES.CONSUMPTIONPOINT)
  qb = filter ? qb.where(whereFilter(filter)) : qb
  qb = fields ? qb.select(fields) : qb
  qb = sort ? qb.orderBy(sort[0], sort[1]) : qb
  return currentPage ? qb.paginate({ perPage, currentPage }) : qb
}

export function get (appId, devId, knex) {
  return knex(TNAMES.CONSUMPTIONPOINT)
    .where({ app_id: appId, dev_id: devId }).first()
}

const editables = [
  'dev_id', 'coef', 'start',
  'sn', 'type', 'sensor_type', 'sensor_sn', 'pipe',
  'desc', 'lat', 'lng', 'alt'
]

export function create (body, knex) {
  body = _.pick(body, editables)
  body.app_id = process.env.APP_ID
  return knex(TNAMES.CONSUMPTIONPOINT).returning('id').insert(body)
}

export function update (devid, body, knex) {
  body = _.pick(body, editables)
  return knex(TNAMES.CONSUMPTIONPOINT).where({ id: devid }).update(body)
}
