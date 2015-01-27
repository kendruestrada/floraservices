/**
* Servicio Rest de las sucursales.
* Sirve para realizar operaciones CRUD sobre las sucursales.  
*/
var express = require('express');
var router = express.Router();


/**
* Varaible del servicio simula una tabla de BD de sucursales en esta se grabaran las sucursales
* ingresadas al servicio.
* 
*/
sucursales = new Array();

/**
* Obtiene el listado de sucursales.
* Se puede enviar en distinto formato dependiendo de los 
* formatos aceptados por el solicitante 
*/
router.get('/sucursal', function(req, res) {

  res.format({
    html: function(){
	 res.render('sucursales',{ sucursales: sucursales });
    },

    xml: function(){
      res.send(json2xml({sucursales:  {sucursal: sucursales}}));
    },

    json: function(){
      res.json({data: sucursales});
    }
  });
});

/**
* Obtiene una sucursal.
* Se puede enviar en distinto formato dependiendo de los 
* formatos aceptados por el solicitante 
*/
router.get('/sucursal/:codigosucursal', function(req, res) {
  sucursalEncontrada = buscarSucursal(req.params.codigosucursal);	
  if(sucursalEncontrada == null){
	console.log("No se encuentra la sucursal solicitada");
	res.statusCode = 404;
	res.write(msg);
	res.end();
	return;
  }
  
  
  res.format({
    html: function(){
	 res.render('sucursal',{ sucursal: sucursalEncontrada });
    },

    xml: function(){
      res.send(json2xml({sucursal: sucursalEncontrada}));
    },

    json: function(){
      res.json({data: sucursalEncontrada});
    }
  });
});


/**
* Ingresa una sucursal.
* Recibe la sucursal en formato json.
* Retorna un mensaje de ok o error en distinto formato dependiendo de los 
* formatos aceptados por el solicitante. Ademas del codigo http correspondiente.
*/
router.post('/sucursal', function(req, res) {
console.log(req.body);
  
  
  console.log(buscarSucursal(req.body.codigo));
  console.log("codigo suc:" + req.body.codigo);
  if(buscarSucursal(req.body.codigo) != null){
	console.log("la sucursal ya existe se retorna error ");
	noPermitido("Se Intenta ingresar una sucursal existente",res);
	return;
  }
  
  console.log(req.body.data.codigo);

  var sucursal = {
    "codigo": req.body.data.codigo,
    "nombre": req.body.data.nombre,    
    "direccion": {
      "pais": req.body.data.pais,
      "ciudad": req.body.data.ciudad,
      "comuna-provincia-sector": req.body.data.sector,
      "calle": req.body.data.calle,
      "numero": req.body.data.numero,
    },
    "telefono": req.body.data.telefono,
  };
  
  sucursales.push(sucursal);
  res.json({ resultado: 'Ok' });
});

/**
* Modifica una sucursal.
* Recibe el identificador de la sucursale en formato json.
* Retorna un mensaje de ok o error en distinto formato dependiendo de los 
* formatos aceptados por el solicitante. Ademas del codigo http correspondiente.
*/
router.put('/sucursal/:codigosucursal', function(req, res) {
  var sucAModificar = buscarSucursal(req.params.codigosucursal);
  if( sucAModificar == null){
	console.log("la sucursal no existe se retorna error ");
	console.log("No se encuentra la sucursal solicitada");
	res.statusCode = 404;
	res.write("No se encuentra la sucursal solicitada");
	res.end();
	return;	
  }
  sucAModificar.nombre = req.body.data.nombre;

  sucAModificar.direccion.pais = req.body.data.pais;
  sucAModificar.direccion.ciudad = req.body.data.ciudad;
  sucAModificar.direccion["comuna-provincia-sector"] = req.body.data.sector;
  sucAModificar.direccion.nombre = req.body.data.nombre;
  sucAModificar.direccion.calle = req.body.data.calle;
  sucAModificar.direccion.numero = req.body.data.numero;
  sucAModificar.telefono = req.body.data.telefono;


  res.json({ resultado: 'Ok' });
});

/**
* Elimina una sucursal.
* Recibe el identificador de la sucursale en formato json.
* Retorna un mensaje de ok o error en distinto formato dependiendo de los 
* formatos aceptados por el solicitante. Ademas del codigo http correspondiente.
*/
router.delete('/sucursal/:codigosucursal', function(req, res) {
  indice = buscarIndiceSucursal(req.params.codigosucursal);	
  if(indice == -1){
	console.log("No se encuentra la sucursal solicitada");
	res.statusCode = 404;
	res.write("No se encuentra la sucursal solicitada");
	res.end();
	return;
  }else{
	sucursales.splice(indice,1);
	res.json({ resultado: 'Ok' });
  }
});



function buscarSucursal( codigoSucursal){
 console.log("num sucursales:" + sucursales.length);
  for(i = 0; i < sucursales.length;i++){
  suc=sucursales[i];
	console.log(suc.codigo);
	if(codigoSucursal == suc.codigo){
		return suc;
	}
  }
  return null;
}

function buscarIndiceSucursal( codigoSucursal){
 console.log("num sucursales:" + sucursales.length);
  for(i = 0; i < sucursales.length;i++){
  suc=sucursales[i];
	if(codigoSucursal == suc.codigo){
		console.log("Sucursale en contrada en el indice:" + i);
		return i;
	}
  }
  return -1;
}


function noPermitido(msg, resp) {
	resp.statusCode = 405;
	resp.write(msg);
	resp.end();
}

/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
function json2xml(o, tab) {
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m] + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v +  "</" + name + ">";
         xml += ind + "<" + name + ">" + v +  "</" + name + ">";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

module.exports = router;
