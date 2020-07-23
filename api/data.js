
import { whereFilter } from 'knex-filter-loopback'
import str from 'underscore.string'
import { ALERTS, TNAMES, BATT_WARN } from '../consts'
import tasks from './tasks'

export default { create, list, createManualy }

async function create (cPoint, body, author, created, knex, auth) {
  const data = {
    pointid: cPoint.id,
    counter: body.wter || null,
    value: body.wter ? (body.wter * cPoint.coef) : body.value,
    author,
    created
  }
  await knex(TNAMES.CONSUMPTIONSTATE).insert(data)

  const pChange = {
    battery: body.batt || null,
    value: data.value,
    temp: body.temp,
    alerts: null
  }
  if (body.batt && body.batt < BATT_WARN) {
    setAlert(ALERTS.BATTLOW, pChange)
    // integrace do taskmanu - ukol pro udrzbare vymenit baterky
    if (!str.include(cPoint.alerts, ALERTS.BATTLOW)) {
      tasks.add(ALERTS.BATTLOW, cPoint)
    }
  }
  // TODO: update value - spocitat
  return knex(TNAMES.CONSUMPTIONPOINT).where({ id: cPoint.id }).update(pChange)
}

function setAlert (alert, change) {
  change.alerts = change.alerts ? `${change.alerts}|${alert}` : alert
}

function list (query, knex) {
  const fields = query.fields ? query.fields.split(',') : null
  const filter = query.filter ? JSON.parse(query.filter) : {}
  const qb = knex(TNAMES.CONSUMPTIONSTATE).where(whereFilter(filter))
  return fields ? qb.select(fields) : qb
}

async function createManualy (devid, body, UID, knex) {
  const cond = { id: devid }
  const cPoint = await knex(TNAMES.CONSUMPTIONPOINT).where(cond).first()
  if (!cPoint) throw new Error(404)
  return create(cPoint, body, UID, new Date(), knex)
}
