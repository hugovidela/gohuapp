'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ComprobanteItem extends Model {
  static get table () {
    return 'comprobantes_items'
  }

  comprobante() {
    return this.belongsTo('App/Models/Comprobante', 'comprobante_id', 'id')
  }
  articulo () {
    return this.belongsTo('App/Models/Articulo', 'articulo_id','id')
  }

}

module.exports = ComprobanteItem
