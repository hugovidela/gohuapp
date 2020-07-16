'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ArticuloFoto extends Model {
  static get table () {
    return 'articulos_fotos'
  }
  
  articulo () {
    return this.belongsTo('App/Models/Articulo')
  }
  
}

module.exports = ArticuloFoto
