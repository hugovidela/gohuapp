'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserTerceroTipo extends Model {
  
  static get table () {
    return 'users_terceros_tipos'
  }

}

module.exports = UserTerceroTipo
