'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserDeposito extends Model {

  static get table () {
    return 'users_depositos'
  }

  sucursal () {
    return this.belongsTo('App/Models/Sucursal', 'sucursal_id','id')
  }

}

module.exports = UserDeposito
