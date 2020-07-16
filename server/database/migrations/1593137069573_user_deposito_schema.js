'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserDepositoSchema extends Schema {
  up () {
    this.create('users_depositos', (table) => {
      table.increments()
      table.integer('sucursal_id').unsigned().references('id').inTable('sucursales')
      table.string('nombre',30).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users_depositos')
  }
}

module.exports = UserDepositoSchema
