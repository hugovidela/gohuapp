'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UnidadSchema extends Schema {
  up () {
    this.create('unidades', (table) => {
      table.increments()
      table.string('nombre', 50).notNullable().unique()
      table.string('tipo', 10).notNullable()
      table.integer('unidad_id').unsigned().references('id').inTable('unidades')
      table.decimal('coeficiente',15.5)
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('unidades')
  }
}

module.exports = UnidadSchema
