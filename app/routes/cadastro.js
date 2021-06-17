module.exports = function(application){
	application.post('/cadastrar', function(req, res){
		application.app.controllers.cadastro.cadastrar(application, req, res);
	});

	application.get('/cadastro', function(req, res){
		application.app.controllers.cadastro.teladecadastro(application, req, res);
	});

    application.get('/cadastro_sucesso', function(req, res){
		application.app.controllers.cadastro.cadastro_sucesso(application, req, res);
	});

	application.get('/cadastro_sem_sucesso', function(req, res){
		application.app.controllers.cadastro.cadastro_sem_sucesso(application, req, res);
	});
	
	application.get('/cadastro_em_avalicao', function(req, res){
		application.app.controllers.cadastro.cadastro_em_avalicao(application, req, res);
	});

	application.get('/admin', function(req, res){
		application.app.controllers.cadastro.admin(application, req, res);
	});

	application.post('/adminset', function(req, res){
		application.app.controllers.cadastro.adminset(application, req, res);
	});


}