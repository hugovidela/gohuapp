'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ComprobantePendiente extends Model {
  static get table () {
    return 'comprobantes_pendientes'
  }

}

module.exports = ComprobantePendiente
