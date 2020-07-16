'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SucursalSchema extends Schema {
  up () {
    this.create('sucursales', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('nombre',50).notNullable()
      table.string('abreviado',10).notNullable()
      table.string('fiscal',4).default('0000')
      table.boolean('electronica').default(false)
      table.boolean('sucursaldemo').default(false)
      table.date('iniactividad')
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('sucursales')
  }
}

module.exports = SucursalSchema
