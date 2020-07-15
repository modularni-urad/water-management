import { TNAMES } from '../consts'
import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'

export default { create, update, list, get }

function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || null
  const q = _.omit(query, 'currentPage', 'perPage')
  const qb = knex(TNAMES.CONSUMPTIONPOINT).where(whereFilter(q))
  return currentPage ? qb.paginate({ perPage, currentPage }) : qb
}

export function get (appId, devId, knex) {
  return knex(TNAMES.CONSUMPTIONPOINT)
    .where({ app_id: appId, dev_id: devId }).first()
}

const editables = ['dev_id', 'coef', 'desc', 'lat', 'lng', 'alt']

export function create (body, knex) {
  body = _.pick(body, editables)
  body.app_id = process.env.APP_ID
  return knex(TNAMES.CONSUMPTIONPOINT).returning('id').insert(body)
}

export function update (devid, body, knex) {
  body = _.pick(body, editables)
  return knex(TNAMES.CONSUMPTIONPOINT).where({ id: devid }).update(body)
}
