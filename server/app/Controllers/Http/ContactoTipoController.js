'use strict'

const ContactoTipo = use('App/Models/ContactoTipo')
const AuthorizationService = use('App/Services/AuthorizationService')

class ContactoTipoController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await ContactoTipo.all()
  }

  async read ({ auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const contactoTipo = await ContactoTipo.find(id)
    AuthorizationService.verifyPermission(contactoTipo, user)
    return contactoTipo
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { id, icono, activo, created_at, updated_at } = params
    const contactoTipo = await ContactoTipo.find(id)
    AuthorizationService.verifyPermission(contactoTipo, user)
    return await contactoTipo
  }

  async last ({ auth }) {
    const user = await auth.getUser()
    return await ContactoTipo.last()
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { icono, activo } = request.all()
    const contactoTipo = new ContactoTipo()
    AuthorizationService.verifyPermission(ContactoTipo, user)
    contactoTipo.fill({icono, activo})
    await contactoTipo.save(contactoTipo)
    return contactoTipo
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const contactoTipo = await ContactoTipo.find(id)
    AuthorizationService.verifyPermission(contactoTipo, user)
    await contactoTipo.delete()
    return contactoTipo
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const contactoTipo = await ContactoTipo.find(id)
    AuthorizationService.verifyPermission(contactoTipo, user)
    contactoTipo.merge(request.only(['icono','activo']))
    await contactoTipo.save()
    return contactoTipo
  }
}

module.exports = ContactoTipoController
