'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VinculoSchema extends Schema {
  up () {
    this.create('vinculos', (table) => {
      table.increments()
      table.integer('user_id_desde').unsigned().references('id').inTable('users')
      table.integer('user_id_hasta').unsigned().references('id').inTable('users')
      table.boolean('articulos',1)
      table.boolean('operaciones',1)
      table.string('estado',1).default('P')
      table.timestamps()
    })
  }

  down () {
    this.drop('vinculos')
  }
}

module.exports = VinculoSchema
