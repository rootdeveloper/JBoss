/**
 * JQuery para Regex dos campos inputs.
 * 
 * O motivo da criação dessa jQuery foi para diminuirmos a quantidade de eventos que setamos os métodos em cada input e previnir o 'piscar'
 * que acontecia nas nossas mascáras iniciais, onde oq colocar um conteúdo inválido, ele aparecia o valor errado e depois o corrigia
 * 
 * Até então, essa jQuery tem compatibilidade com o Chrome(1 - 24), Firefox(3 - 16) e IE(8) dos SOs Windows XP, Windows 7 e Ubuntu 11.04
 * 
 * A respeito dos browsers, o IE e Chrome funcionam da mesma forma no evento de keypress.
 * O Firefox tem uma particularidade em invocar esse evento até nas teclas que não contém valor a ser inserido, como as setas e o home.
 * 
 * Já no evento de 'colar', cada um se comporta de uma forma diferente:
 * IE 		-> utiliza o evento 'paste' que é invocado antes do colar. Eu nego a ação, mas recupero o valor colado da área de transferência e insiro manualmente.
 * CHROME 	-> utiliza o evento 'textInput' que também é invocado antes de colar. Também nego a ação, porém recupero o valor colado do próprio evento.
 * FIREFOX 	-> utiliza o evento 'paste' que é invocado antes de colar. Não nego a ação, pois não tenho outra forma de pegar o valor a ser colado.
 * Assim salvo o valor inicial e o valor final para comparálos e saber o valor que foi colado.
 * 
 * Enfim, seto o cursor do mouse após o valor inserido, seja ele pelo colar ou pelo keypress.
 * 
 * A única questão deste código é a respeito do Firefox, onde eu preciso deixar ele colar o valor, assim ele continua a piscar a informação errada e depois a correta
 * 
 */
(function($) {
	$.fn.regex = function(dados) {
		var e, k, beforeLength, removedSize;
		var input = $(this);
		var length = dados.length;
		var ranges = new Array();
		ranges['letraMinuscula'] = [97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122];
		ranges['letraMaiuscula'] = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90],
		ranges['letraMinusculaAcentuada'] = [241,231,224,225,226,227,228,232,233,234,235,236,237,238,239,242,243,244,245,246,249,250,251,252],
		ranges['letraMaiusculaAcentuada'] = [209,199,192,193,194,195,196,200,201,202,203,204,205,206,207,210,211,212,213,214,217,218,219,220],
		ranges['letraSimples'] = ranges['letraMinuscula'].concat(ranges['letraMaiuscula']);
		ranges['letra'] = ranges['letraMinuscula'].concat(ranges['letraMaiuscula']).concat(ranges['letraMinusculaAcentuada']).concat(ranges['letraMaiusculaAcentuada']);
		ranges['numero'] = [48,49,50,51,52,53,54,55,56,57];
		ranges['espaco'] = [32];
		ranges[','] = [44];
		ranges['-'] = [45];
		ranges['.'] = [46];
		ranges[';'] = [59];
		ranges['@'] = [64];
		ranges['_'] = [95];
		
		
		var values = new Array();
		for(var i in dados.caracteres) {
			values = values.concat(ranges[dados.caracteres[i]]);
		}
		
		/*
		 * Método acionado quando o evento de keypress é invocado
		 */
		function keypressEvent(e) {
			e = e || window.event;
			k = e.charCode || e.keyCode || e.which;
			if($.browser.mozilla) { // Firefox aciona o keypress com qualquer tecla, tenho que verificar se é backspace, end ou setas por exemplo
				if(e.ctrlKey) { // CTRL
					if(k == 118 || k == 99 || k == 120 || k == 97) { // V, C, X, A
						return true;
					}
				}
				if((e.keyCode == 37 && e.charCode == 0) || (e.keyCode == 39 & e.charCode == 0)) { // Setas para esquerda e direita do firefox
					return true;
				} else if((e.keyCode == 35 && e.charCode == 0)
						|| (e.keyCode == 36 && e.charCode == 0)
						|| (e.keyCode == 45 && e.charCode == 0)
						|| (e.keyCode == 46 && e.charCode == 0)) { // end, home, insert e del do firefox
					return true;
				} else if(k == 116 || k == 8) { // F5 ou backspace
					return true;
				} else if(k == 13 || k == 9) { // enter ou tab
					input.change();
					return true;
				}
			}
			var position = getPosition();
			if(input.val().length >= length && position[1] - position[0] == 0) { // verifico se o tamanho do valor a ser inserido não ultrapassa o tamanho do campo
				return false;
			} else {
				return validateCode(k);
			}
		}
		
		/*
		 * Continuação do método beforePaste, onde eu verifico o valor a ser colado e altero o valor do input. 
		 * No final eu seto o cursor no local correto
		 */
		function pasteEvent(start, end, val, valPaste, e) {
			var newString = "";
			for(var i = 0; i < valPaste.length; i++) {
				if(validateCode(valPaste[i].charCodeAt(0))) {
					newString = newString.concat(valPaste[i]);
				}
			}
			var pastLength = newString.length;
			var valLength = val.length;
			var tamanho = valLength + pastLength;
			
			if(tamanho > length) {
				newString = newString.substring(0, length - valLength);
				pastLength = newString.length;
			}
			
			var startString = val.substring(0, start);
			var endString = val.substring(end, valLength);
			newString = startString + newString + endString;
			
			var position = start + pastLength;
			input.val(newString);
			var el = input.get(0);
			if(el.setSelectionRange) {
				el.focus();
				el.setSelectionRange(position, position);
			} else if(el.createTextRange) {
				setTimeout(function() { 
					var range = el.createTextRange();
					range.moveStart('character', position);
					range.collapse(true);
					range.select();
				}, 0);
			}
		}
		
		/*
		 * Valido cada codigo da letra de acordo com os parâmetros da regex
		 */
		function validateCode(k) {
			if(k == undefined) {
				return false;
			} else {
				for(var i in values) {
					if(values[i] == k) {
						return true;
					}
				}
				return false;
			}
		}
		
		/*
		 * Método acionado ao ser invocado o evento de colar
		 */
		function beforePaste(e) {
			var val;
			var valPaste;
			var points = getPosition();
			if($.browser.msie) { // No caso do IE eu consigo recuperar o valor diretamente da área de transferência
				val = input.val();
				valPaste = clipboardData.getData('Text');
			} else if($.browser.webkit) { // No Chrome, o evento possui o valor a ser colado
				val = input.val();
				valPaste = e.originalEvent.data;
			} else { // Já no Firefox, eu pego o valor inicial e o valor final e os comparo para saber o valor que estou colando
				var tamanhoColado = input.val().length - beforeLength + removedSize;
				val = input.val().substring(0, points[0] - tamanhoColado) + input.val().substring(points[0], input.val().length);
				valPaste = input.val().substring(points[0] - tamanhoColado, points[0]);
				points[0] = points[0] - tamanhoColado;
				points[1] = points[1] - tamanhoColado;
			}
			pasteEvent(points[0], points[1], val, valPaste, e);
			
			return false;
		}
		
		/*
		 * Recupera a posição inicia e a posição final da seleção/cursor no input
		 */
		function getPosition() {
			var el = input.get(0);
			var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;
			if(typeof el.selectionStart == "number"
					&& typeof el.selectionEnd == "number") {
				start = el.selectionStart;
				end = el.selectionEnd;
			} else {
				range = document.selection.createRange();
				if(range && range.parentElement() == el) {
					len = el.value.length;
					textInputRange = el.createTextRange();
					textInputRange.moveToBookmark(range.getBookmark());

					endRange = el.createTextRange();
					endRange.collapse(false);

					if(textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
						start = end = len;
					} else {
						start = -textInputRange.moveStart("character", -len);
						start += el.value.slice(0, start).split("\n").length - 1;

						if(textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
							end = len;
						} else {
							end = -textInputRange.moveEnd("character", -len);
							end += el.value.slice(0, end).split("\n").length - 1;
						}
					}
				}
			}
			return [start, end];
		}
		
		/*
		 * Verifico os valores iniciais do input para depois compará-lo e descobrir o valor colado
		 */
		function beforeFirefox(e) {
			var position = getPosition();
			removedSize = position[1] - position[0];
			beforeLength = input.val().length;
			setTimeout(function() { beforePaste(e); }, 0);
		}
		
		// Seto os métodos que serão acionados ao ser iniciado os eventos
		if($.browser.msie) {
			input.bind('keypress', keypressEvent);
			input.bind('paste drop', beforePaste);
		} else if($.browser.webkit){
			input.bind('keypress', keypressEvent);
			input.bind('textInput', beforePaste);
		} else {
			input.bind('paste', beforeFirefox);
			input.bind('keypress', keypressEvent);
		}
	};

})(jQuery);
