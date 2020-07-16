'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RubrosSchema extends Schema {
  up () {
    this.create('rubros', (table) => {
      table.increments()
      table.string('nombre', 50).notNullable().unique()
      table.boolean('user_id')    // cada usuario podra tener sus rubros
      table.boolean('privado')    // y podra determinar si es privado o publico
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('rubros')
  }
}

module.exports = RubrosSchema
