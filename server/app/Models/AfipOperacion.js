'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AfipOperacion extends Model {
  static get table() {
    return 'afip_operaciones'
  }
}

module.exports = AfipOperacion
