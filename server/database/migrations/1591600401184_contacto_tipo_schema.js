'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContactoTipoSchema extends Schema {
  up () {
    this.create('contactos_tipos', (table) => {
      table.increments()
      table.string('icono', 10).notNullable().unique()
      table.boolean('activo')      
      table.timestamps()
    })
  }

  down () {
    this.drop('contactos_tipos')
  }
}

module.exports = ContactoTipoSchema
