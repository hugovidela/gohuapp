'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CalleSchema extends Schema {
  up () {
    this.create('calles', (table) => {
      table.increments()
      table.string('nombre', 40).notNullable().unique()
      table.boolean('activo')   
      table.timestamps()
    })
  }

  down () {
    this.drop('calles')
  }
}

module.exports = CalleSchema
