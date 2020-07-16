'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PrecioSchema extends Schema {
  up () {
    this.create('precios', (table) => {
      table.increments()
      table.integer('articulo_id').unsigned().references('id').inTable('articulos')
      table.integer('lista_id').unsigned().references('id').inTable('users_listas') // de ahi saco el usuario
      table.integer('comprobante_item_id').unsigned().references('id').inTable('comprobantes_items')
      table.decimal('costo',15,4) // valores netos
      table.decimal('porrem',5,2)
      table.decimal('precio',15,4) // valores netos
      table.timestamps()
    })
  }

  down () {
    this.drop('precios')
  }
}

module.exports = PrecioSchema
