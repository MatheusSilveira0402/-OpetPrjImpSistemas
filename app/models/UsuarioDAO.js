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
                                            var ava = 1;
                                            dadosForm.ava = ava; 
                                            
                                            collection.insert(dadosForm);
                                            res.redirect("cadastro_em_avalicao");
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
                    req.session.senha = result[0].senha;
                    req.session.ava = result[0].ava;
                        

                    }
                }
                
                if(req.session.ava == 1){
                    res.redirect("cadastro_em_avalicao");
                }else{
                
                    if(req.session.autorizado == true){
                    
                        req.session.usuario = dadosForm.usuario;
                        var dados = req.body;
                        application.get('io').emit(
                            'msgParaCliente',
                            {usuario: dados, mensagem: ' acabou de entrar no chat' + req.session.usuario}
                        )
                            
                        
                        console.log(req.session.usuario,"-", req.session.senha, "-", req.session.ava);
                        res.render("chat", {dadosForm: dados});

                        mongoclient.close();

                    } else{
                        
                        res.redirect("login_sem_sucesso");
                        mongoclient.close();
                    }
                }
            });
        });
    });
}

UsuarioDAO.prototype.listarUsuario = function(res, req){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
           
            collection.find({ava:{$eq:1}}).toArray(function(err,result){
                
                if(result != null){
                    

                    res.render("tela_do_admin", {dadosForm: result});
                }

            });
            mongoclient.close();

        });
    });
}

UsuarioDAO.prototype.aprovarUsuario = function(dados,res, req){
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            var user = dados.usuario;
            var decisao = dados.desicao;
            console.log(user)
            if(user != 0){  
                if(decisao === "reprovar"){
                    collection.deleteOne({usuario:{$eq: user}}, function(err, result){

                    });

                   

                }else{
                    
                    collection.update({ava: 1, usuario:{$eq: user}}, {$set: {ava: 0}}, function(err, result){
                        
                    });
                    
                }
                
                collection.find({ava:{$eq:1}}).toArray(function(err,result){
                    
                    if(result != null){

                        res.render("tela_do_admin", {dadosForm: result});
                    
                    }
                    mongoclient.close();
                });
                
            }
            
            else{

                res.send("não deu");
            
            }
        });
    });
}


module.exports = function(){
    return UsuarioDAO;
}