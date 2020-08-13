'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterPreciosAddEstadoSchema extends Schema {
  up () {
    this.table('precios', (table) => {
      table.string('estado',1).after('precio').default('A')
    })
  }

  down () {
    this.table('precios', (table) => {
      table.dropColumn('estado')
    })
  }
}

module.exports = AlterPreciosAddEstadoSchema
