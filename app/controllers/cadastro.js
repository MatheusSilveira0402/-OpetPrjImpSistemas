

module.exports.teladecadastro = function(application, req, res){
	res.render("cadastro", {validacao : {}, dadosForm:{}});
}

module.exports.cadastrar = function(application, req, res){
	
	var dadosForm = req.body;


	req.assert('usuario','Nome completo é campo obrigatório').notEmpty();
	req.assert('usuario','Usuário  é campo obrigatório').notEmpty();
	req.assert('usuario','Usuário deve conter entre 3 e 15 caracteres').len(3, 15);
	req.assert('curso', 'Curso  é campo obrigatório').notEmpty();
    req.assert('data', 'Data é campo obrigatório').notEmpty();
	req.assert('senha','senha é campo obrigatório').notEmpty();
	req.assert('senha','senha deve conter entre 3 e 15 caracteres').len(3, 15);

	var erros = req.validationErrors();

	if(erros){
		res.render("cadastro", {validacao : erros, dadosForm: dadosForm})
		return;
	}
	

	var connection = application.config.connectiondb;
	var UsuariosDAO = new application.app.models.UsuarioDAO(connection);
	

	
	
	UsuariosDAO.inserirUsuario(dadosForm, res, req);


}
module.exports.cadastro_sucesso = function(application, req, res){
	res.render('cadastro_com_sucesso');
}

module.exports.cadastro_sem_sucesso = function(application, req, res){
	res.render('cadastro_sem_sucesso');
}