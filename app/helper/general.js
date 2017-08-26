
module.exports.Query = function(callback,sql,db) {
    db.query(sql, function(err, rows, fields) {
        
        if (!err)
        	if(rows.length  ==0)
            	callback('nodata');
        	else
        		callback(rows);
        else
            callback(null);
    });

}

module.exports.Error = function (res,error){
	 res.status(400);  res.send(err);  throw err;
	 console.log(err);  
}

module.exports.Pagina  = function(url,ruta,param,app){
	app.get(url,function(req,res){  
	// res.set('Content-Type', 'application/javascript');

  param['ln'] =  res;
	  res.render(ruta, param);
      res.status(200);
	//res.sendFile(path.join(__dirname+'/app/views/registro.html'), { name: "example" });
	});
}

