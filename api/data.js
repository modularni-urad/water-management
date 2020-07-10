import { whereFilter } from 'knex-filter-loopback'
import _ from 'underscore'
import { TNAMES } from '../consts'

export default { create, list, createManualy }

async function create (cPoint, body, author, created, knex) {
  const data = {
    pointid: cPoint.id,
    counter: body.wter || null,
    value: body.wter ? (body.wter * cPoint.coef) : body,
    author,
    created
  }
  await knex(TNAMES.CONSUMPTIONSTATE).insert(data)

  // TODO: if type === battery ...
  // TODO: update value, battery, temp
  return knex(TNAMES.CONSUMPTIONPOINT).where({ id: cPoint }).update({
    battery: body.batt || null,
    value: data.value,
    temp: body.temp
  })
}

function list (query, knex) {
  const perPage = Number(query.perPage) || 10
  const currentPage = Number(query.currentPage) || null
  const q = _.omit(query, 'currentPage', 'perPage')
  const qb = knex(TNAMES.CONSUMPTIONPOINT).where(whereFilter(q))
  return currentPage ? qb.paginate({ perPage, currentPage }) : qb
}

async function createManualy (devid, body, UID, knex) {
  const cond = { id: devid }
  const cPoint = await knex(TNAMES.CONSUMPTIONPOINT).where(cond).first()
  if (!cPoint) throw new Error(404)
  return create(cPoint, body, UID, new Date(), knex)
}
