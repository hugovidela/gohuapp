'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TerceroContactoSchema extends Schema {
  up () {
    this.create('tercero_contactos', (table) => {
      table.increments()
      table.integer('tercero_id').unsigned().references('id').inTable('terceros')
      table.integer('contacto_tipo_id').unsigned().references('id').inTable('contactos_tipos')
      table.string('observaciones',60)
      table.timestamps()
    })
  }

  down () {
    this.drop('tercero_contactos')
  }
}

module.exports = TerceroContactoSchema
