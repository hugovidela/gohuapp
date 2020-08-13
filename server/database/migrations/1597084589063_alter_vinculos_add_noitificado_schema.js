'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterVinculosAddNoitificadoSchema extends Schema {
  up () {
    this.table('vinculos', (table) => {
      table.boolean('notificado').after('lista')
      table.boolean('activo').after('notificado')
    })
  }

  down () {
    this.table('vinculos', (table) => {
      table.dropColumn('notificado')
      table.dropColumn('activo')
    })
  }
}

module.exports = AlterVinculosAddNoitificadoSchema
