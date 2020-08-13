'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificacionSchema extends Schema {
  up () {
    this.create('notificaciones', (table) => {
      table.increments()
      table.integer('user_id_desde').unsigned().references('id').inTable('users')
      table.integer('user_id_hasta').unsigned().references('id').inTable('users')
      table.string('tipo',2)
      table.string('detalles',30)
      table.string('estado',1)
      table.timestamps()
    })
  }

  down () {
    this.drop('notificaciones')
  }
}

module.exports = NotificacionSchema
