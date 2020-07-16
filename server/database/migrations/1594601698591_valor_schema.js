'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ValorSchema extends Schema {
  up () {
    this.create('valores', (table) => {
      table.increments()
      table.integer('caja_id').unsigned().references('id').inTable('cajas')
      table.integer('medio_id').unsigned().references('id').inTable('medios_de_pagos')
      table.integer('cpringreso_id').unsigned().references('id').inTable('comprobantes')
      table.integer('cpregreso_id').unsigned().references('id').inTable('comprobantes')
      table.integer('librador_id').unsigned().references('id').inTable('terceros')
      table.integer('librador_medio_id').unsigned().references('id').inTable('terceros_medios_de_pagos')
      table.integer('cheque_id').unsigned() // id del cheque propio ( chequeras ?? )
      table.date('fechafinanciera')
      table.date('fechasalida')
      table.decimal('importe',15,2)
      table.integer('nrovalor')
      table.string('tipo',1).notNullable() // debe haber
      table.string('observ',50) // debe haber
      table.timestamps()
    })
  }

  down () {
    this.drop('valores')
  }
}

module.exports = ValorSchema
