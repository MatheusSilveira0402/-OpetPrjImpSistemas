const crypto = require("crypto");


/* Aqui vai ter funções que se conectaram com banco de dados*/
function UsuarioDAO(connection){
    this._connection = connection();
    this._valid = '';
}

UsuarioDAO.prototype.inserirUsuario = function(usuario, res){
    this._connection.open( function(err, monogoclient){
            var valido;
        monogoclient.collection("cursos", function(err, collection){       
            var dadosForm = usuario;
            var curso = dadosForm.curso;
            
            collection.find({curso:{$eq:curso}}).toArray(function(err, result){

                    if(!result[0] == 0){
                        if(result[0].curso == dadosForm.curso){
                            monogoclient.collection("usuarios", function(err, collection){       
                                var dadosForm = usuario;
                                var user = dadosForm.usuario;
                                
                                collection.find({usuario:{$eq:user}}).toArray(function(err, result){
                
                                        if(!result[0] == 0){
                                            if(result[0].usuario == dadosForm.usuario){
                                                res.redirect("cadastro_sem_sucesso");
                                                monogoclient.close();  
                                            }
                                                
                                        }else {    
                                            var senha_criptografada = crypto.createHash("md5").update(dadosForm.senha).digest("hex");
                
                                            dadosForm.senha =  senha_criptografada;
                
                                            collection.insert(dadosForm);
                                            res.redirect("cadastro_sucesso");
                                            monogoclient.close();
                                        }
                                });       
                            });
                            
                        }
                            
                    }else {    
                        console.log("NÃO DEU");
                        res.redirect("cadastro_sem_sucesso");
                        monogoclient.close();
                        
                    }
            });
                     
        });

    });
}


UsuarioDAO.prototype.autenticar = function(usuario, req, res, application){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            
            var dadosForm = usuario;
            var user = dadosForm.usuario;
            //var dados = req.body;
            
            collection.find({usuario:{$eq:user}}).toArray(function(err, result){
                
                if(!result[0] == 0){
                    
                    if(result[0].usuario == dadosForm.usuario){
                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                  }
                }
                if(req.session.autorizado == true){
                 
                    req.session.usuario = dadosForm;
                    application.get('io').emit(
                        'msgParaCliente',
                        {usuario: req.session.usuario, mensagem: ' acabou de entrar no chat'}, console.log(req.session.usuario)
                    )
                  
                    
                    console.log(req.session.usuario);
                    res.render("chat", {dadosForm:req.session.usuario});

                    mongoclient.close();

                } else{
                    
                    res.redirect("login_sem_sucesso");
                    mongoclient.close();
                }
            });
        });
    });
}


module.exports = function(){
    return UsuarioDAO;
}