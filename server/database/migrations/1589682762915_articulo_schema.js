'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticuloSchema extends Schema {
  up () {
    this.create('articulos', (table) => {
      table.increments()
      table.string('codigo', 40).notNullable().unique()
      table.string('codbar', 13).notNullable().unique()
      table.string('nombre', 80).notNullable().unique()
      table.integer('rubro_id').unsigned().references('id').inTable('rubros')
      table.integer('grupo_id').unsigned().references('id').inTable('grupos')
      table.integer('marca_id').unsigned().references('id').inTable('marcas')
      table.integer('creador_id').unsigned().references('id').inTable('users')
      table.integer('padre_id').unsigned().references('id').inTable('articulos')
      table.integer('um_compra_id').unsigned().references('id').inTable('unidades')
      table.integer('um_venta_id').unsigned().references('id').inTable('unidades')
      table.integer('um_stock_id').unsigned().references('id').inTable('unidades')
      table.integer('iva_id').unsigned()
      table.integer('moneda_id').unsigned().references('id').inTable('afip_monedas')
      table.decimal('coeficiente',5,2)
      table.boolean('secompra')
      table.boolean('sevende')
      table.boolean('stock')
      table.string('iva').notNullable()
      table.boolean('activo')
      table.timestamps()      
    })
  }

  down () {
    this.drop('articulos')
  }
}

module.exports = ArticuloSchema
