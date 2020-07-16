'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comprobante extends Model {
  static get table () {
    return 'comprobantes'
  }

  tercero () {
    return this.belongsTo('App/Models/Tercero', 'tercero_id','id')
  }

  direccion () {
    return this.hasOne('App/Models/TerceroDireccion', 'direccion_id','id')
  }

  items () {
    return this.hasMany('App/Models/ComprobanteItem', 'id', 'comprobante_id')
  }

  pendientes () {
    return this.hasMany('App/Models/ComprobantePendiente', 'id', 'comprobante_id')
  }

  valoresIngresos () {
    return this.hasMany('App/Models/Valor', 'id', 'cpringreso_id')
  }

  valoresEgresos () {
    return this.hasMany('App/Models/Valor', 'id', 'cpregreso_id')
  }

}

module.exports = Comprobante
