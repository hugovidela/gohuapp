'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComprobanteItemSchema extends Schema {
  up () {
    this.create('comprobantes_items', (table) => {
      table.increments()
      table.integer('comprobante_id').unsigned().references('id').inTable('comprobantes')
      table.integer('articulo_id').unsigned().references('id').inTable('articulos')
      table.integer('deposito_id').unsigned().references('id').inTable('users_depositos')
      table.integer('unidad_id').unsigned().references('id').inTable('unidades')
      table.integer('moneda_id').unsigned().references('id').inTable('afip_monedas')
      table.integer('iva_id').unsigned().references('id').inTable('afip_iva')
      table.decimal('cantidad',15,4)
      table.decimal('costo',15,4)
      table.decimal('precio',15,4)
      table.decimal('preciooriginal',15,4)
      table.decimal('tasadescuento',5,2)
      table.decimal('importedescuento',15,4)
      table.decimal('total',15,2)
      table.text('texto')
      table.date('vencimiento')
      table.timestamps()
    })
  }

  down () {
    this.drop('comprobantes_items')
  }
}

module.exports = ComprobanteItemSchema
