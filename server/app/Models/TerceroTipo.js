'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TerceroTipo extends Model {
  static get table () {
    return 'terceros_tipos'
  }
  UserTercero() {
    return this.belongsToMany('App/Models/UserTercero')
  }
}


module.exports = TerceroTipo
