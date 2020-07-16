'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CajaSchema extends Schema {
  up () {
    this.create('cajas', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.date('fechadesde')
      table.date('fechahasta')
      table.boolean('cerrada')
      table.integer('nrocaja')
      table.timestamps()
    })
  }
  down () {
    this.drop('cajas')
  }
}

module.exports = CajaSchema
