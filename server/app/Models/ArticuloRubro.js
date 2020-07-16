'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ArticuloRubro extends Model {
  static get table () {
    return 'articulos_rubros'
  }

  articulo () {
    return this.belongsTo('App/Models/Articulo', 'articulo_id', 'id')
  }

}

module.exports = ArticuloRubro
