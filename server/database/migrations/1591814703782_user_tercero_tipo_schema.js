'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserTerceroTipoSchema extends Schema {
  up () {
    this.create('users_terceros_tipos', (table) => {
      table.increments()
      table.integer('user_tercero_id').unsigned().references('id').inTable('users_terceros')
      table.integer('tipo_id').unsigned().references('id').inTable('users_tipos')
      table.timestamps()
    })
  }

  down () {
    this.drop('usesr_terceros_tipos')
  }
}

module.exports = UserTerceroTipoSchema
