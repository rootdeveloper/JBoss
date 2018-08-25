var j = jQuery.noConflict();

/**
 *Funcao JS para customização visual dos "..." 
 **/
/**
 * Quando a arvore DOM estiver populada são invocados os métodos aqui declarados
 */
j(document).ready(function(){
	setarFocusChaveAcessoPainelCTeTerceiros();
	reSize();
});	

/**
 * Quando a janela o browser estiver sendo redimensionado executa as funções aqui declaradas
 */
j(window).resize(function(){
	reSize();
});

/**
 * Método que ajusta o conteúdo do componente que tiver o class .Truncate é reajustado
 */
function reSize(){
	j('.Truncate').each(function(){
		j(this).children().html(j(this).children().attr('title'));
		var hasChange = false;
		var aux = j(this).children().attr('title');
		while(j(this).width() < j(this).children().width()){
			aux = aux.substring(0, aux.length - 1);
			j(this).children().html(aux);
			hasChange = true;
		}
		if (hasChange){
			j(this).children().html(aux.substring(0, aux.length - 3) + "...");		
		}
	});
}

/**
 * Seta o focus no primeiro input da pagina
 */
function focusFirstInput() {
//	alert(j(":input[tabindex='1']").attr("id"));
	j(":input[tabindex='1']").first().focus();
}

function setarFocusChaveAcessoPainelCTeTerceiros(){
	var chave=j('#chaveDeAcesso');
	if(chave!=null){
		chave.focus();
	}
}

function efetuarSubmitNoBotaoAoPressionarEnter(botao, event){
	if(event.keyCode == 13) {
		botao.click();
		return false;
	}
	return true;
}

function formataTabelaCTesTerceiro() {
	j('.rf-edt-hdr').children().first().addClass('Largura100pc');
	
	
	var tabelaCteTerceiros = "#tableCteTerceiros";
	j(tabelaCteTerceiros).children().eq(0).remove();
	
	tabelaCteTerceiros = '#tableCteTerceiros\\:header';
	
	j(tabelaCteTerceiros).children().first().addClass('Largura100pc');
	
	tabelaCteTerceiros = '#tableCteTerceiros\\:b';
	j(tabelaCteTerceiros).children().children().eq(1).addClass('Largura100pc');
	
	tabelaCteTerceiros = '#tableCteTerceiros\\:tbtn';
	j(tabelaCteTerceiros).addClass('Largura100pc');

}

/*
 * Funcao que recupera os estilos do botao adicionar quando o usuario clicar no botao cancelar
 */
j('.rf-fu-itm-lnk').live('click', function () {
	j('.rf-fu-btn-add').removeClass('botaoDesabilitado');
	j('.rf-fu-btn-add').addClass('botaoAdicionarImportacao');
});

/*
 * Funcao que detecta a inclusao de um arquivo para upload, inclui o css de botao desabilitado
 * e coloca como hidden o botao de limpar lista
 */
j('.rf-fu-inp').live('change', function () {
	var qtd = j('.rf-fu-lst').children().size();

	if(qtd != 0) {
		j('.rf-fu-btn-add').addClass('botaoDesabilitado');
		j('.rf-fu-btn-add').removeClass('botaoAdicionarImportacao');
		j('.rf-fu-btn-clr').addClass('displayHidden');
	} 
});

/*
 *  Funcao que inclui o estilo para hover no botao adicionar, com o intuito de 
 *  nao alterar o css padrao do botao adicionar
 */
function trocarStyleBotaoAdicionar() {
	j('.rf-fu-btn-add').addClass('botaoAdicionarImportacao');
}
	
	
/*
 * FUncao que verifica quanto itens jah foram incluidos na lista de importacao.
 * Necessario para customizar o componente do richfaces que ainda nao disponibiliza o suporte para limitar a quantidade
 * de arquivos para upload
 */
function verificaQuantidade() {
	var qtd = j('.rf-fu-lst').children().size();

	
	if(qtd != 0) {
		return false;
	} 
	
	return true;
}

function showLoad(){
	
	var maskHeight = j(document).height();
	var maskWidth = j(window).width();

	j('#mask').css({'width':maskWidth,'height':maskHeight});

	j('#mask').fadeIn(0);	
		

	//Get the window height and width
	var winH = j(window).height();
	var winW = j(window).width();
          
	j('#dialog').css('top',  winH/2-j('#dialog').height()/2);
	j('#dialog').css('left', winW/2-j('#dialog').width()/2);

	j('#dialog').fadeIn(0);
}

function hideLoad(){
	j('#mask').css({'width':0,'height':0});
	j('.window').hide();
}


//window.onbeforeunload = function (evt) {
//	  var message = 'Are you sure you want to leave?';
//	  if (typeof evt == 'undefined') {
//	    evt = window.event;
//	  }
//	  if (evt) {
//	    evt.returnValue = message;
//	  }
//	  return message;
//	}

/**
 * Funcao que verifica se foi digitado os 44 digitos da chave de acesso, para disparar a action do MB para consulta do CTe
 */
function scanner(valor) { 
//	alert(valor.length);
//	alert(valor)
	if(valor.length == 44) {
		consultarCTe(valor);
	}  
} 

/**
 * Funcao JS para setar focus em um campo a partir do ID
 * @param campo
 */
function focus(campo) {
	field = "#" + campo;
	field = j(field);
	if(field != null) {
		field.focus();
	}
}

j(":input").live('input paste mousedown mouseup',function (e){
	j(this).keydown().focus();
});

/**
 * Bloqueia o evento keypress/keydown sejam pressionadas no conteudo do id passado.
 */
function blockKeyPress(id){
	j('#'+id).on("keypress keyup keydown", function(){
		return false;
	});
}
/**
 * 'Mata' os handlers do evento keypress/keydown relacionados ao id passado.
 */
function unBlockKeyPress(id){
	j('#'+id).off("keyup keypress keydown");
}

