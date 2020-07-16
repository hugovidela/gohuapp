'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Postal extends Model {
  static get table () {
    return 'postales'
  }
  provincia () {
    return this.belongsTo('App/Models/Provincia')
  }

}

module.exports = Postal
