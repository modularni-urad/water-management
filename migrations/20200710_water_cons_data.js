import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.CONSUMPTIONSTATE, (table) => {
    table.integer('pointid').notNullable()
      .references('id').inTable(TNAMES.CONSUMPTIONPOINT)
    table.string('author')
    table.integer('counter')
    table.float('value').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.primary(['pointid', 'created'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.CONSUMPTIONSTATE)
}
