'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Sucursal extends Model {

  static get table () {
    return 'sucursales'
  }

  depositos () {
    return this.hasMany('App/Models/UserDeposito','id','sucursal_id')
  }

}

module.exports = Sucursal
