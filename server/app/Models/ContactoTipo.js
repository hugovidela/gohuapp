'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ContactoTipo extends Model {
  static get table () {
    return 'contactos_tipos'
  }
}

module.exports = ContactoTipo
