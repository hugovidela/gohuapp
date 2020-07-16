'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterArticulosDescripcionSchema extends Schema {
  up () {
    this.table('articulos', (table) => {
      table.text('descripcion')
    })
  }

  down () {
    this.table('articulos', (table) => {
      table.dropColumn('descripcion')
    })
  }
}

module.exports = AlterArticulosDescripcionSchema
