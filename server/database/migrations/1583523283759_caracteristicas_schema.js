'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaracteristicasSchema extends Schema {
  up () {
    this.create('caracteristicas', (table) => {
      table.increments()
      table.string('nombre', 50).notNullable().unique()
      table.integer('caracteristica_id').unsigned().references('id').inTable('caracteristicas')
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('caracteristicas')
  }
}

module.exports = CaracteristicasSchema
