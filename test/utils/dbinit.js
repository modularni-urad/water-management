import _ from 'underscore'
const Knex = require('knex')
const knexHooks = require('knex-hooks')

// const rand = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15)
// process.env.DATABASE_URL = rand + 'test.sqlite'

export default function initDB (migrationsDir) {
  const opts = {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_URL
    },
    useNullAsDefault: true,
    debug: true,
    migrations: {
      directory: migrationsDir
    }
  }
  const knex = Knex(opts)
  knexHooks(knex)
  knex.addHook('before', 'insert', 'consumption_point', (when, method, table, params) => {
    const data = knexHooks.helpers.getInsertData(params.query)
    data.info = data.info ? JSON.stringify(data.info) : '{}'
    data.settings = JSON.stringify(data.settings)
  })

  function _2JSON (row, attrs) {
    _.each(attrs, attr => {
      row[attr] = JSON.parse(row[attr])
    })
  }
  knex.addHook('after', 'select', 'consumption_point', (when, method, table, params) => {
    params.result && _.isArray(params.result)
      ? _.each(params.result, row => { _2JSON(row, ['info', 'settings']) })
      : _2JSON(params.result, ['info', 'settings'])
  })

  return knex.migrate.latest().then(() => {
    return knex
  })
}
