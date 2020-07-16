'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Pais extends Model {
  static get table () {
    return 'paises'
  }
  /*
  provincias () {
    return this.hasMany('App/Models/Provincias')
  }
  */ 
}

module.exports = Pais
