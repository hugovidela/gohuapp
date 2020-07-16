'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserTerceroLista extends Model {

  static get table () {
    return 'users_terceros_listas'
  }

  lista() {
    return this.belongsTo('App/Models/UserLista')
  }

}

module.exports = UserTerceroLista
