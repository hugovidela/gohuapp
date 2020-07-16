'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Provincia extends Model {
  static get table () {
    return 'provincias'
  }
  pais () {
    return this.belongsTo('App/Models/Pais','pais_id','id')
  }
  postales () {
    return this.hasMany('App/Models/Postal')
  }
}

module.exports = Provincia
