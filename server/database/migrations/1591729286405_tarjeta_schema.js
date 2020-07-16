'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TarjetaSchema extends Schema {
  up () {
    this.create('tarjetas', (table) => {
      table.increments()
      table.string('codigo', 3).notNullable().unique()
      table.string('nombre',40).notNullable()
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('tarjetas')
  }
}

module.exports = TarjetaSchema
