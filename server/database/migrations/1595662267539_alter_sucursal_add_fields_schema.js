'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUserAddFieldsSchema extends Schema {
  up () {
    this.table('sucursales', (table) => {
      table.string('color',15).after('iniactividad');
    })
  }

  down () {
    this.table('sucursales', (table) => {
      table.dropColumn('color')
    })
  }
}

module.exports = AlterUserAddFieldsSchema
