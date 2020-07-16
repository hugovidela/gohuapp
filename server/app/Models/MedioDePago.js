'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MedioDePago extends Model {
  static get table () {
    return 'medios_de_pagos'
  }
}

module.exports = MedioDePago
