'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserTercero extends Model {

  static get table () {
    return 'users_terceros'
  }

  static scopeByUser (query, user_id) {
    if (user_id) {
      query.whereHas('users', query => {
        if (user_id instanceof Array) {
          query.whereIn('user_id', user_id)
        } else {
          query.where('user_id', user_id)
        }
      })
    }
  }  

  tercero() {
    return this.belongsTo('App/Models/Tercero')
  }
  users() {
    return this.belongsTo('App/Models/User')
  }
  
  terceroTipos() {
    return this.belongsToMany('App/Models/TerceroTipo', 'user_tercero_id', 'tipo_id','id','id')
    .pivotTable('users_terceros_tipos')
    .withTimestamps()
  }
  terceromediosdepago() {
    return this.hasMany('App/Models/TerceroMedioDePago','id','user_tercero_id')
  }
  terceroListas() {
    return this.hasMany('App/Models/UserTerceroLista', 'id','user_tercero_id')
  }
}




module.exports = UserTercero
