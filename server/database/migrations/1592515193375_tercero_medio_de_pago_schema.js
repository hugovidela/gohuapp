'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TerceroMedioDePagoSchema extends Schema {
  up () {
    this.create('tercero_medios_de_pagos', (table) => {
      table.increments()
      table.integer('usertercero_id').unsigned().references('id').inTable('users_terceros')
      table.integer('mediodepago_id').unsigned().references('id').inTable('medios_de_pagos')
      table.integer('banco_id').unsigned().references('id').inTable('bancos')
      table.integer('tarjeta_id').unsigned().references('id').inTable('tarjetas')
      table.string('tarjeta_numero',20)
      table.string('banco_cuenta',20)
      table.string('banco_cbu',30)
      table.integer('dias_vencimiento',4)
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('tercero_medios_de_pagos')
  }
}

module.exports = TerceroMedioDePagoSchema
