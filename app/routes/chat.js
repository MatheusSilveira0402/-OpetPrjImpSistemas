module.exports = function(application){
	application.get('/chat', function(req, res){
		application.app.controllers.chat.iniciaChat(application, req, res);
	});

	application.post('/chat', function(req, res){
		application.app.controllers.chat.autenticar(application, req, res);
	});

	application.get('/sair', function(req, res){
		application.app.controllers.chat.sair(application, req, res);
	});

	application.get('/login_sem_sucesso', function(req, res){
		application.app.controllers.chat.login_sem_sucesso(application, req, res);
	});
}