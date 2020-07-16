'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterArticulosSchema extends Schema {
  up () {
      this.alter('articulos', (table) => {
        table.dropColumn('coeficiente')
        table.decimal('un_compra',10,5)
        table.decimal('un_venta',10,5)
        table.decimal('un_stock',10,5)
    })
  }

  down () {
    this.table('articulos', (table) => {
      table.decimal('coeficiente',5,2)
      table.dropColumn('un_compra')
      table.dropColumn('un_venta')
      table.dropColumn('un_stock')
    })    
  }
}

module.exports = AlterArticulosSchema
