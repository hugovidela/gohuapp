'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComprobanteSchema extends Schema {
  up () {
    this.create('comprobantes', (table) => {
      table.increments()
      table.date('fecha').notNullable()
      table.string('cpr',19).notNullable() // FACAX-0001-00000001
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('sucursal_id').unsigned().references('id').inTable('sucursales')
      table.integer('tercero_id').unsigned().references('id').inTable('terceros')
      table.integer('documento_id').unsigned().references('id').inTable('afip_documentos')
      table.integer('mediodepago_id').unsigned().references('id').inTable('medios_de_pagos')
      table.integer('lista_id').unsigned().references('id').inTable('users_listas')
      table.integer('deposito_id').unsigned().references('id').inTable('users_depositos')
      table.integer('vendedor_id').unsigned().references('id').inTable('terceros')
      table.integer('moneda_id').unsigned().references('id').inTable('afip_monedas')
      table.integer('direccion_id').unsigned().unsigned().references('id').inTable('terceros_direcciones')
      table.decimal('tasadescuento',5,2)
      table.decimal('importedescuento',15,2)
      table.decimal('gravado',15,2)
      table.decimal('exento',15,2)
      table.decimal('iva',15,2)
      table.decimal('total',15,2)
      table.boolean('regstk').default(true)
      table.string('estado')
      table.string('cae')
      table.date('cae_vencimiento')
      table.string('cae_codbar')
      table.text('observaciones')
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('comprobantes')
  }
}

module.exports = ComprobanteSchema
