import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.CONSUMPTIONPOINT, (table) => {
    table.increments('id').primary()
    table.string('dev_id')
    table.string('app_id').notNullable()
    table.string('desc').notNullable()
    table.string('sen_sn')
    table.string('sen_type')
    table.string('ext_id')
    table.float('battery')
    table.float('temp')
    table.float('coef')
    table.float('start')
    table.float('value')
    table.float('lat')
    table.float('lng')
    table.float('alt')
    table.string('alerts')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.CONSUMPTIONPOINT)
}
