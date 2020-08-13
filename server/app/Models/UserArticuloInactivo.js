'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserArticuloInactivo extends Model {
  static get table () {
    return 'users_articulos_inactivos'
  }
  user () {
    return this.belongsTo('App/Models/User', 'user_id','id')
  }
  articulo () {
    return this.belongsTo('App/Models/Articulo', 'articulo_id','id')
  }
}

module.exports = UserArticuloInactivo
