'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaisSchema extends Schema {
  up () {
    this.create('paises', (table) => {
      table.increments()
      table.string('codigo', 3).notNullable().unique()
      table.string('nombre',40).notNullable()
      table.string('caract_tel',5)
      table.boolean('activo')      
      table.timestamps()
    })
  }

  down () {
    this.drop('paises')
  }
}

module.exports = PaisSchema
