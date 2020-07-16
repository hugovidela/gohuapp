'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Caracteristica extends Model {
  caracteristicas () {
    return this.belongsToMany('App/Models/Caracteristica').withPivot(['caracteristica_id'])
  }
}

module.exports = Caracteristica
