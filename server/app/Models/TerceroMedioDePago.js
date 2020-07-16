'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TerceroMedioDePago extends Model {
  static get table () {
    return 'terceros_medios_de_pagos'
  }

  tarjeta () {
    return this.belongsTo('App/Models/Tarjeta', 'tarjeta_id', 'id')
  }
  banco () {
    return this.belongsTo('App/Models/Banco', 'banco_id', 'id')
  }
  mediodepago() {
    return this.belongsTo('App/Models/MedioDePago', 'mediodepago_id', 'id')
  }

  usertercero() {
    return this.belongsTo('App/Models/UserTercero', 'user_tercero_id', 'id')
  }

}

module.exports = TerceroMedioDePago
