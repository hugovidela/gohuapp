'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Notificacion extends Model {
  static get table () {
    return 'notificaciones'
  }

  userdesde () {
    return this.belongsTo('App/Models/User', 'user_id_desde','id')
  }

  userhasta () {
    return this.belongsTo('App/Models/User', 'user_id_hasta','id')
  }

  comprobante () {
    return this.belongsTo('App/Models/Comprobante', 'comprobante_id','id')
  }


}

module.exports = Notificacion
