/**
 * Seta a referencia para jQuery na variavel j para não haver conflitos
 */
var j = jQuery.noConflict();

/**
 * Método para setar um valor de tabindex num elemento
 * 
 * @param id
 * @param index
 */
function setaTabIndex(id, index){
	document.getElementById(String(id)).tabIndex = index;
}

/**
 * Muda o focus para o elemento cujo id é passado por parâmetro 
 */
function mudaFocus(id){
	//alert(document.getElementById(String(id)))
	document.getElementById(String(id)).focus();
	document.getElementById(String(id)).select();
}

/**
 * Quando a arvore DOM estiver populada são invocados os métodos aqui declarados
 */
j(document).ready(function(){
	reSize();
	focusTab();
	focus("chaveDeAcesso");
	blockDuploCliqueCheckbox();
});	

function clearDrag() {
	j(document).bind("dragstart", function() {
	    return false;
	});
}

function desabilitarBotaoEsquerdo() {
	j(document)[0].oncontextmenu = function() {return false;};  
}

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
	
	j('.Truncate').each(function() {
		
		objAux = j(this);
		objSpan = objAux.children();
		
		var hasChange = false;
		var aux = objSpan.attr('title');
		
		tamanhoAux = objAux.width();
		
		while(tamanhoAux < objSpan.width()) {
			aux = aux.substring(0, aux.length - 1);
			objSpan.html(aux);
			hasChange = true;
		}
		
		if (hasChange) {
			objSpan.html(aux.substring(0, aux.length - 3) + "...");		
		}
	});
};

/**
 * Função que capitaliza uma string
 * @param ustr
 */
function upper(ustr) 
{ 
    var str=ustr.value;
    ustr.value=str.toUpperCase(); 
} 

/**
 * Bloqueia o backspace
 * Impedindo que o browser retorne para a página anterior
 * @param event
 * @see #unblockBackSpace
 */
function blockBackSpace(event) {
		if(event.keyCode == 8) {
			j(document).bind("keydown.blockBackSpace", function(){
				return false;
			});
		}
}
/**
 * Bloqueia tecla de espaço.
 * @param event
 * @param e
 * @returns {Boolean}
 */
function blockSpace(event, e) {
	
	if(event.keyCode == 32) {
		
		alert(event.keyCode == 32);
		
		return false;
	}
}
/**
 * Remove o handler 'blockBackSpace' utilizado na 
 * função blockBackSpace
 * @see #blockBackSpace
 */
function unblockBackSpace() {
	j(document).unbind(".blockBackSpace");
	
}
	

/**
 * Metodo que desabilita os inputs do form principal
 * Deve ser utilizado quando tivermos um modal com iteracao com o usuario
 */
function disableInputsFormPrincipal() {
	blockKeyPress("formConteudo");
}

/**
 * Metodo que habilita os inputs do form principal
 * Deve ser utilizado quando tivermos um modal com iteracao com o usuario
 */
function enableInputsFormPrincipal() {
	unBlockKeyPress("formConteudo");
}

/**
 * Metodo que desabilita os selects do form principal
 * Deve ser utilizado quando tivermos um modal com iteracao com o usuario
 */
function disableSelectsFormPrincipal() {
	j('#formConteudo select').attr('disabled', true);
}

/**
 * Metodo que habilita os selects do form principal
 * Deve ser utilizado quando tivermos um modal com iteracao com o usuario
 */
function enableSelectsFormPrincipal() {
	j('#formConteudo select').attr('disabled', false);
}
/**
 * Seta a aba inicial sempre que a mesma for criada e
 * caso seja informado o class de algum checkbox seta o
 * focus para o campo checkbox informado.
 *
 * @param classTab Class da aba a ser definida como padrao
 * @param classCheckbox Class do checkbox a ser setado o focus
 */
function iniciaFocusModal(classTab, classCheckbox) {
	tab = '.' + classTab;
	j(tab).trigger('click');
	if (classCheckbox != null && classCheckbox.length > 0) {
		checkbox = '.' + classCheckbox;
		j(checkbox).focus();
	}
}

/**
 * Função js que recebe um class do checkBox para ser utilizado como seletor e
 * altera o status do mesmo para false
 */
function alteraStatusCheckboxParaUnchecked(classCheckbox) {
	if (classCheckbox != null && classCheckbox.length > 0) {
		checkbox = '.' + classCheckbox;
		j(checkbox).prop("checked", false);
	}
}

/**
 * Função js que recebe um class do checkBox para ser utilizado como seletor e
 * simula um click no mesmo
 */
function clickCheckbox(classCheckbox) {
	if (classCheckbox != null && classCheckbox.length > 0) {
		checkbox = '.' + classCheckbox;
		j(checkbox).prop("checked", false);
		j(checkbox).trigger('click');
	}
}

/**
 * Funcao generica que deve ser utilizada para controlar o focus tab nos inputs
 */
function focusTab() {
	jQuery('input, img, select, textarea').live("keydown", function(e) {
		
		var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;

		
		if (key == 9) {  // 9 para TAB
			var inputs =  jQuery(this).parents("form").eq(0).find(":input:text:visible:enabled:not([readonly='readonly']), :input:checkbox:visible:enabled, :input:password:visible:enabled, .BotaoImagemSemMarginTop:visible, .ComboField:visible:enabled, .TabWalk:visible:enabled, .SelectMultiple:visible:enabled");
			var idx = inputs.index(this);
			var move = (e.shiftKey) ? (-1) : (1); // para Shift+TAB
 
			//alert(inputs.length)
			//alert(idx)
			//alert(j(this).attr('id'))

			if(move == 1) {
				if (idx == inputs.length - 1) {
					inputs[0].focus();
				} else {
					//Verifica se o proximo input tem pai na arvore
					while(!inputs[idx + move].offsetParent && (inputs.length >= idx && idx >= -1)) {
						idx += move;
					}
					inputs[idx + move].focus(); // handles submit buttons
				}
			} else {
				// o else soh entra via Shift +TAB
//				alert(idx)
				if(idx == 0) {
					inputs[inputs.length-1].focus();
				}
				else if(idx == 1) {
					inputs[0].focus();
					//inputs[inputs.length-1].focus();
				} else {
					//Verifica se o proximo input tem pai na arvore
					while(!inputs[idx + move].offsetParent && (inputs.length >= idx && idx >= -1)) {
						idx += move;
					}
					inputs[idx + move].focus(); 
				}
			}    
			return false;
		}
	});
}


/*
 * Funcao que recupera os estilos do botao adicionar quando o usuario clicar no
 * botao cancelar
 */
j('.rf-fu-itm-lnk').live('click', function () {
	j('.rf-fu-btn-add').removeClass('botaoDesabilitado');
	j('.rf-fu-btn-add').addClass('botaoAdicionarImportacao');
});

/*
 * Funcao que detecta a inclusao de um arquivo para upload, inclui o css de
 * botao desabilitado e coloca como hidden o botao de limpar lista
 */
j('.rf-fu-inp').live('change', function () {
	var qtd = j('.rf-fu-lst').children().size();

	if(qtd != 0) {
		j('.rf-fu-btn-add').addClass('botaoDesabilitado');
		j('.rf-fu-btn-add').removeClass('botaoAdicionarImportacao');
		j('.rf-fu-btn-clr').addClass('displayHidden');
	} 
});

/**
 * Funcao que inclui o estilo para hover no botao adicionar, com o intuito de
 * nao alterar o css padrao do botao adicionar
 */
function trocarStyleBotaoAdicionar() {
	j('.rf-fu-btn-add').addClass('botaoAdicionarImportacao');
}
	
	
/**
 * FUncao que verifica quanto itens jah foram incluidos na lista de importacao.
 * Necessario para customizar o componente do richfaces que ainda nao
 * disponibiliza o suporte para limitar a quantidade de arquivos para upload
 */
function verificaQuantidade() {
	var qtd = j('.rf-fu-lst').children().size();

	
	if(qtd != 0) {
		return false;
	} 
	
	return true;
}

/**
 * Funcao JS para setar focus em um campo a partir do ID
 * 
 * @param campo
 */
function focus(campo) {
	field = "#" + campo;
	field = j(field);
	if(field != null) {
		field.focus().select();
	}
}

/**
 * Seta o focus no primeiro input da pagina
 */
function focusFirstInput() {
//	alert(j(":input[tabindex='1']").attr("id"));
	j(":input[tabindex='1']").first().focus();
}


/**
 * Função para bloquear o submit atraves do enter.
 * 
 * @param botao
 * @param event
 * @returns {Boolean}
 */
function bloqueioEnter(event){
	if(event.keyCode == 13) {
		return false;
	}
	return true;
}

/**
 * Seta os eventod de blur e focus ao clicar com a tecla enter
 * 
 * @param component
 * @param event
 */
function executeFilter(component,event){
	if(event.keyCode==13){   
		valueChangeIE(component); // preciso disparar o evento de change no IE
		j(component).blur();
		j(component).focus();
	}
}

/**
 * Seta o class botaoDesabilitado no componente passado por parâmetro
 * 
 * @param componente
 */
function desabilitarComponente(componente) {
	campo = "#" + componente;
	j(campo).prop("disabled", true);
	j(campo).addClass('botaoDesabilitado');
}

/**
 * Função js que recebe o class do formulario e para cada checkbox existente no mesmo
 * desmarcar o mesmo. Após efetua a simulacao de clique. 
 * @param idForm Identificado do formulário
 */
function desmarcaCheckboxForm(classForm) {
	if (classForm != null && classForm.length > 0) {
		formulario = "." + classForm;
		j(formulario).find("input[type='checkbox']").each(function() {j(this).prop("checked", false);});
	}
}

/**
 * Função para restringir o focus dentro de uma aba
 * 
 * Esta função não esta sendo mais utilizada devido a nova implementação de controle de focus
 * 
 * @param event
 * @param tabPanel
 * @param classFocoDefault
 * @param classFocoSecundario
 * @param form
 * @param componenteComFoco
 * @returns
 */
function desviaTab(event, tabPanel, classFocoDefault, classFocoSecundario, form, componenteComFoco){
	tecladoTab = false;
	//verifica se componente possui determinado class
	if (j(componenteComFoco).hasClass(classFocoSecundario)) {
	idTabPanel = "#" + tabPanel;
		// procura abas
	j(idTabPanel).find(".rf-tab").each(function() {
			// verifica qual aba está selecionada
		if (j(this).css("display") == "block") {
				//pega a aba que está selecionada
			idAba = "#" + j(this).prop('id');
			campoDefault = "." + classFocoDefault;
			// procura o campo default de determinada aba a ser setado o focus
			focaCampoDefault =  j(idAba).find(campoDefault);
			idFocaCampoDefault = "#" + j(focaCampoDefault).prop('id');
			// verifica se possui o id simples ou se o id é por exemplo:
			// tabelaStatus:checkboxStatus
			index = idFocaCampoDefault.lastIndexOf(":") + 1;
			if (index > 1) {
				idFocaCampoDefault = "." + idFocaCampoDefault.substring(index, idFocaCampoDefault.length);
			}
				//caso o usuário tenha clicado somente com TAB
			if (event.shiftKey == false && event.keyCode == 9) {
				j(idFocaCampoDefault).focus();
				tecladoTab = true;
			}
		}
	});
	} else if (j(componenteComFoco).hasClass(classFocoDefault)) {
		//caso o usuário tenha clicado SHIFT + TAB
		if (event.shiftKey == true && event.keyCode == 9) {
			idForm = "#" + form;
			campoSecundario = "." + classFocoSecundario;
			// procura o campo secundário de determinada formulário a ser setado o focus
			focaCampoSecundario =  j(idForm).find(campoSecundario);
			idFocaCampoSecundario = "#" + j(focaCampoSecundario).prop('id');
			j(idFocaCampoSecundario).focus();
			tecladoTab = true;
		}
	}
	return !tecladoTab;
}

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

/**
 * Estas linhas abaixo são utilizadas no painelListaSituacaoTributaria para selecionar todas as linhas referentes ao seu grupo imposto
 */
j('.rowspanCOFINS').live('mouseover', function () {
	j('.rowCOFINS').addClass('SelecionaLinha');
});
j('.rowspanCOFINS').live('mouseout', function () {
	j('.rowCOFINS').removeClass('SelecionaLinha');
});
j('.rowspanIPI').live('mouseover', function () {
	j('.rowIPI').addClass('SelecionaLinha');
});
j('.rowspanIPI').live('mouseout', function () {
	j('.rowIPI').removeClass('SelecionaLinha');
});
j('.rowspanPIS').live('mouseover', function () {
	j('.rowPIS').addClass('SelecionaLinha');
});
j('.rowspanPIS').live('mouseout', function () {
	j('.rowPIS').removeClass('SelecionaLinha');
});
j('.rowspanICMS').live('mouseover', function () {
	j('.rowICMS').addClass('SelecionaLinha');
});
j('.rowspanICMS').live('mouseout', function () {
	j('.rowICMS').removeClass('SelecionaLinha');
});

/**
 * Altera o estilo do componente, cuja a sua classe tem as palavras rowspan e o nome passado por parametro 
 * @param nome
 */
function mudaClassRowSpanOver(nome) {
	j('.rowspan'+nome).addClass('SelecionaLinha');
}

/**
 * Altera o estilo do componente, cuja a sua classe tem as palavras rowspan e o nome passado por parametro
 * @param nome
 */
function mudaClassRowSpanOut(nome) {
	j('.rowspan'+nome).removeClass('SelecionaLinha');
}

/**
 * Seta o evento change no IE
 * @param a
 */
function valueChangeIE(a) {
	if (j.browser.msie) {
		a.onchange();
	}
}

/**
 * Funcao que verifica se foi digitado os 44 digitos da chave de acesso, para disparar a action do MB para consulta do CTe
 */
function scanner(valor) { 
	if(valor.length == 44) {
		consultarNFe(valor);
	}  
} 

/**
 * Zera a contagem de páginas do scroller
 * 
 * @param idScroller
 */
function zerarScroller(idScroller) {
	//alert(idScroller)
    //componente = j('div$='+idScroller);
	componente = j('.scrollerTeste');
	//alert(componente[0])
	//alert(componente);
	//componente = j('div[id*=' + idScroller +']');
	Event.fire(componente[0], 'rich:datascroller:onscroll', {'page': 'first'});
	//Event.fire(componente[0], 'rich:datascroller:onscroll', {'page': 'first'});
}

/**
 * Bloqueia o duplo clique no checkbox impedindo que o browser retorne para a página anterior
 */
function blockDuploCliqueCheckbox() {
	j(':input:checkbox:visible:enabled').dblclick(function() {
//		alert(j(this).prop('id'));
		return false;
	});
}

function log() {
    try {
        console.log.apply(console, arguments);
    } catch(e) {
        try {
            opera.postError.apply(opera, arguments);
        } catch(e) {
            alert(Array.prototype.join.call(arguments, " "));
        }
    }
}