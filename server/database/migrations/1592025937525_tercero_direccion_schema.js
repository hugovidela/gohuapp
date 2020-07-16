'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TerceroDireccionSchema extends Schema {
  up () {
    this.create('terceros_direcciones', (table) => {
      table.increments()
      table.integer('tercero_id').unsigned().references('id').inTable('terceros')
      table.integer('calle_id').unsigned().references('id').inTable('calles')
      table.integer('postal_id').unsigned().references('id').inTable('postales')
      table.string('numero',6)
      table.string('pisodepto',8)
      table.string('tipo',1)
      table.integer('entrecalle1_id').unsigned().references('id').inTable('calles')
      table.integer('entrecalle2_id').unsigned().references('id').inTable('calles')
      table.string('observaciones',40)
      table.timestamps()
    })
  }

  down () {
    this.drop('terceros_direcciones')
  }
}

module.exports = TerceroDireccionSchema
