/* importar as configurações do servidor */
var app = require('./config/server');

/* parametrizar a porta de escuta */
var server = app.listen(80, function(){
	console.log('Servidor online');
})

var io = require('socket.io').listen(server);

app.set('io', io);

/* criar a conexão por websocket */
io.on('connection', function(socket){
	console.log('Usuário conectou');

	socket.on('disconnect', function(){
		console.log('Usuário desconectou');
	});

	socket.on('msgParaServidor', function(data){

		/* dialogo */
		socket.emit(
			'msgParaCliente', 
			{usuario: data.usuario, mensagem: data.mensagem}
		);

		socket.broadcast.emit(
			'msgParaCliente', 
			{usuario: data.usuario, mensagem: data.mensagem}
		);


		/* participantes */
		if(parseInt(data.usuario_atualizado_nos_clientes) == 0){
			socket.emit(
				'participantesParaCliente', 
				{usuario: data.usuario}
			);

			socket.broadcast.emit(
				'participantesParaCliente', 
				{usuario: data.usuario}
			);
		}
	});

});
