'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tag extends Model {

  static get table () {
    return 'tags'
  }
  articulos () {
    return this.belongsToMany('App/Models/Articulo','tags_id','articulo_id','id','id')
      .pivotTable('articulos_tags')
  }
}

module.exports = Tag
