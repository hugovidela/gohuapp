'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ComprobantePendiente extends Model {
  static get table () {
    return 'comprobantes_pendientes'
  }

  comprobante() {
    return this.belongsTo('App/Models/Comprobante', 'comprobante_id', 'id')
  }

}

module.exports = ComprobantePendiente
