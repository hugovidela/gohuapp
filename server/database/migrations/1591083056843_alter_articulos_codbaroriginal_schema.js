'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterArticulosCodbaroriginalSchema extends Schema {
  up () {
    this.table('articulos', (table) => {
      table.boolean('codbaroriginal')
    })
  }

  down () {
    this.table('articulos', (table) => {
      table.dropColumn('codbaroriginal')
    })
  }
}

module.exports = AlterArticulosCodbaroriginalSchema
