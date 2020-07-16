'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MedioDePagoSchema extends Schema {
  up () {
    this.create('medios_de_pagos', (table) => {
      table.increments()
      table.string('nombre',40).notNullable().unique()
      table.string('abrev',2).notNullable().unique()
      table.boolean('activo')
      table.timestamps()
    })
  }

  down () {
    this.drop('medios_de_pagos')
  }
}

module.exports = MedioDePagoSchema
