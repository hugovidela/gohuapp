'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserTerceroListaSchema extends Schema {
  up () {
    this.create('users_terceros_listas', (table) => {
      table.increments()
      table.integer('user_tercero_id').unsigned().references('id').inTable('users_terceros')
      table.integer('user_lista_id').unsigned().references('id').inTable('users_listas')
      table.date('fechaultact')
      table.decimal('porrem',7,2)
      table.boolean('activo')      
      table.timestamps()
    })
  }

  down () {
    this.drop('users_terceros_listas')
  }
}

module.exports = UserTerceroListaSchema
