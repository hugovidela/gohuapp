'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserRubro extends Model {

  static get table () {
    return 'users_rubros'
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  rubro() {
    return this.belongsTo('App/Models/Rubro')
  }


}

module.exports = UserRubro
