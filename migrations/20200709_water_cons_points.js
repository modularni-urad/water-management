import { TNAMES, STATE } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.CONSUMPTIONPOINT, (table) => {
    table.increments('id').primary()
    table.string('dev_id')
    table.string('app_id').notNullable()
    table.string('desc').notNullable()
    table.float('battery').notNullable().defaultTo(0)
    table.float('temp').notNullable().defaultTo(0)
    table.float('coef').notNullable().defaultTo(1)
    table.float('value')
    table.float('lat')
    table.float('lng')
    table.float('alt')
    table.string('state').notNullable().defaultTo(STATE.NORMAL)
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.CONSUMPTIONPOINT)
}
