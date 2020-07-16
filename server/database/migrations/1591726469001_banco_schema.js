'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BancoSchema extends Schema {
  up () {
    this.create('bancos', (table) => {
      table.increments()
      table.string('codigo', 3).notNullable().unique()
      table.string('nombre',40).notNullable()
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('bancos')
  }
}

module.exports = BancoSchema
