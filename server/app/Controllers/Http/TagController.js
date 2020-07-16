'use strict'

const Tag = use('App/Models/Tag')
const AuthorizationService = use('App/Services/AuthorizationService')

class TagController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await Tag.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { nombre } = params
    const tag = await Tag.findBy('nombre', nombre )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await tag ? true : false
  }
  
  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { nombre, activo } = request.all()
    const tag = new Tag()
    AuthorizationService.verifyPermission(tag, user)
    tag.fill({nombre,activo})
    await tag.save(tag)
    return tag
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const tag = await Tag.find(id)
    AuthorizationService.verifyPermission(tag, user)
    await tag.delete()
    return tag
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const tag = await Tag.find(id)
    AuthorizationService.verifyPermission(tag, user)
    tag.merge(request.only(['nombre','activo']))
    await tag.save()
    return tag
  }
}

module.exports = TagController
