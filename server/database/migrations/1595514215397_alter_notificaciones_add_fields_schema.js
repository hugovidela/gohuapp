'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterNotificacionesAddFieldsSchema extends Schema {
  up () {
    this.table('notificaciones', (table) => {
      table.integer('comprobante_id').unsigned().references('id').inTable('comprobantes').after('user_id_hasta');
    })
  }

  down () {
    this.table('notificaciones', (table) => {
      table.dropColumn('comprobante_id')
    })
  }
}

module.exports = AlterNotificacionesAddFieldsSchema
