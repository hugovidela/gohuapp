'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserLista extends Model {

  static get table () {
    return 'users_listas'
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

}

module.exports = UserLista
