module.exports.iniciaChat =	function(application, req, res){

	if(req.session.autorizado){
		res.render("chat", {dadosForm: req.session.usuario});

		
		
	} else {
		res.send('Usuario precisa fazer  login ');

	}
}
module.exports.autenticar = function(application, req, res){
	
	var dadosForm = req.body;



	req.assert('usuario','Usuário  é campo obrigatório').notEmpty();
	req.assert('usuario','Usuário deve conter entre 3 e 15 caracteres').len(3, 15);
	req.assert('senha','senha é campo obrigatório').notEmpty();
	req.assert('senha','senha deve conter entre 3 e 15 caracteres').len(3, 15);
	
	var erros = req.validationErrors();

	if(erros){
		res.render("index", {validacao : erros})
		return;
	}

	
	var connection = application.config.connectiondb;
	
	var UsuariosDAO = new application.app.models.UsuarioDAO(connection);

	UsuariosDAO.autenticar(dadosForm, req, res, application);


}

module.exports.sair = function(application, req, res){
	req.session.destroy(function(err){
		res.render("index", {validacao: {}});
	});
}

module.exports.login_sem_sucesso = function(application, req, res){
	res.render("login_sem_sucesso");
}