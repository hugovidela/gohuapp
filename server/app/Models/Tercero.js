'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tercero extends Model {

  static get table () {
    return 'terceros'
  }

  /*
  static scopeByUser (query, user_id) {
    if (user_id) {
      if (user_id instanceof Array) {
        query.whereIn('user_id', user_id)
      } else {
        query.where('user_id', user_id)
      }
    }
  }
  */
  
  /*
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

  */
  responsable () {
    return this.belongsTo('App/Models/AfipResponsable', 'responsable_id', 'id')
  }
  documento () {
    return this.belongsTo('App/Models/AfipDocumento', 'documento_id', 'id')
  }
  direcciones() {
    return this.hasMany('App/Models/TerceroDireccion', 'id','tercero_id')
  }
  contactos() {
    return this.hasMany('App/Models/TerceroContacto', 'id','tercero_id')
  }
  users () {
    return this.hasMany('App/Models/UserTercero')
  }
  terceroTipos() {
    return this.belongsToMany('App/Models/TerceroTipo', 'user_tercero_id', 'tipo_id','id','id')
    .pivotTable('users_terceros_tipos')
    .withTimestamps()
  }
  mediosdepago() {
    return this.hasMany('App/Models/TerceroMedioDePago','id','user_tercero_id')
  }
  usersterceros() {
    return this.hasMany('App/Models/UserTercero','id','tercero_id')
  }
}
module.exports = Tercero
