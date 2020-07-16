'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Caja extends Model {

  static get table () {
    return 'cajas'
  }

  user () {
    return this.belongsTo('App/Models/User', 'user_id', 'id')
  }

}

module.exports = Caja
