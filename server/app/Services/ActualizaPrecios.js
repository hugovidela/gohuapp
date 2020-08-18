'use strict'

const Excel   = require('exceljs')
const Articulo = use('App/Models/Articulo')
const UserLista = use('App/Models/UserLista')
const Precio  = use('App/Models/Precio')

class ActualizaPrecios {

  static async ImportClassification000(filelocation, lista) {
    var workbook = new Excel.Workbook()
    workbook = await workbook.xlsx.readFile(filelocation)
    let explanation = workbook.getWorksheet('Hoja1') // get sheet name
    let colComment = explanation.getColumn('A') //column name
    let lis = lista
    const ul = await UserLista.find(lis) //busco la lista, recordemos que hay una lista por usuario
    let porrem = ul.porrem
    let actualizados = 0
    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 1) {
        let codigo = explanation.getCell('A' + rowNumber).value+''
        let precio = explanation.getCell('E' + rowNumber).value
        let art = await Articulo.findBy('codigo', codigo)
        if (art) {
          let l = await Precio.query()
            .where('articulo_id', art.id)
            .where('lista_id', lis)
            .fetch()
            if (l.rows.length!=0) {
              l.rows[0].costo = precio
              l.rows[0].porrem = porrem
              l.rows[0].precio = precio*(1+(porrem/100))
              await l.rows[0].save()
              actualizados ++
            } else {
              //let prec = await Precio.create(pre)
              //console.log('not found...',art.id)
            }
        }
      }
    })
  }

  static async ImportClassification(filelocation, lista) {

    function promiseSqrt(value){
      return new Promise(function (fullfill, reject){
        setTimeout(function() {
            fullfill({ value: value, result: value + 1 });
        }, 0 | Math.random() * 100);
      });
    }
  
    var workbook = new Excel.Workbook()
    workbook = await workbook.xlsx.readFile(filelocation)
    let explanation = workbook.getWorksheet('Hoja1') // get sheet name
    let colComment = explanation.getColumn('A') //column name
    let lis = lista
    const ul = await UserLista.find(lis) //busco la lista, recordemos que hay una lista por usuario
    let porrem = ul.porrem
    let actualizados = 0
    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 1) {
        let codigo = explanation.getCell('A' + rowNumber).value+''
        let precio = explanation.getCell('E' + rowNumber).value
        let art = await Articulo.findBy('codigo', codigo)
        if (art) {
          let l = await Precio.query()
            .where('articulo_id', art.id)
            .where('lista_id', lis)
            .fetch()
            if (l.rows.length!=0) {
              l.rows[0].costo = precio
              l.rows[0].porrem = porrem
              l.rows[0].precio = precio*(1+(porrem/100))
              await l.rows[0].save()
              actualizados ++
              var obj = await promiseSqrt(actualizados)
              //console.log('objresult=', obj.result)
              actualizados = obj.result
            } else {
              //let prec = await Precio.create(pre)
              //console.log('not found...',art.id)
            }
        }
      }
      console.log('actualizados...', actualizados)
      return actualizados
    })
    console.log('actualizados final...', actualizados)
    return actualizados
  }

}

module.exports = ActualizaPrecios