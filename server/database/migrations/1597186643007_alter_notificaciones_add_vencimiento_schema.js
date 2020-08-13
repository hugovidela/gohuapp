'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterNotificacionesAddVencimientoSchema extends Schema {
  up () {
    this.table('notificaciones', (table) => {
      table.date('vencimiento').after('estado')
    })
  }

  down () {
    this.table('notificaciones', (table) => {
      table.dropColumn('vencimiento')
    })
  }
}

module.exports = AlterNotificacionesAddVencimientoSchema
