'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AfipIva extends Model {
  static get table() {
    return 'afip_iva'
  }
}

module.exports = AfipIva
