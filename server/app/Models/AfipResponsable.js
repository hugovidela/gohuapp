'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AfipResponsable extends Model {
  static get table() {
    return 'afip_responsables'
  }
}

module.exports = AfipResponsable
