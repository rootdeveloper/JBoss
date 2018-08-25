/*
 * @Copyright (c) 2011 Aurélio Saraiva, Diego Plentz
 * @Page http://github.com/plentz/jquery-maskmoney
 * try at http://plentz.org/maskmoney

 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * @Version: 1.4.1
 * @Release: 2011-11-01
 */
(function($) {
//	var byPassKeys = [8,9,37,38,39,40],
//    specialChars = {':': 191, '-': 189, '.': 190, '(': 57, ')': 48, '/': 191, ',': 188, '_': 189, ' ': 32, '+': 187},
//    e, m, fieldObject, oValue, oNewValue, oCleanedValue, keyCode, keyPressedString, pMask;
	
	$.fn.maskMoney = function(settings) {
		settings = $.extend({
			symbol : 'US$',
			showSymbol : false,
			symbolStay : false,
			thousands : ',',
			decimal : '.',
			precision : 2,
			defaultZero : true,
			allowZero : false,
			allowNegative : false,
			percent : false,
			ignoreZeroVal : true,
			maskMoney : true,
			mask : '99.999'
		}, settings);

		return this
				.each(function() {
					var input = $(this);
					
					var dirty = false;

					function markAsDirty() {
						dirty = true;
					}

					function clearDirt() {
						dirty = false;
					}

					function keypressEvent(e) {
						
						e = e || window.event;
						var k = e.charCode || e.keyCode || e.which;
						
						log('keypress ' + k);
						
						if (k == undefined)
							return false; // needed to handle an IE "special"
											// event
						if (input.attr('readonly') && (k != 13 && k != 9))
							return false; // don't allow editing of readonly
											// fields but allow tab/enter

						if (k < 48 || k > 57) { // any key except the numbers
												// 0-9
							if (k == 45) { // -(minus) key
								markAsDirty();
								if(settings.maskMoney) {
									input.val(changeSign(input));
								} else if($.browser.mozilla){
									return true; // nos browsers, o 45 tb é o insert, mas no FF preciso habilitar para funcionar o SHIFT+INSERT
								}
								return false;
							} else if (k == 43) { // +(plus) key
								markAsDirty();
								if(settings.maskMoney) {
									input.val(input.val().replace('-', ''));
								}
								return false;
							} else if (k == 13 || k == 9) { // enter key or tab
															// key
								if(settings.maskMoney) {
									if(settings.ignoreZeroVal && input.val() == '0,00') { // para ignorar submits de valor 0,00
										input.val('');
										//$(this).change();
									}
								} 
								if (dirty) {
									clearDirt();
									$(this).change();
								}
								log('keypress event antes do return quando for tab')
								return true;
							} else if ((e.keyCode == 37 && e.charCode == 0) || (e.keyCode == 39 & e.charCode == 0)) { // left arrow key or right arrow key
								// Somente o Firefox tem keycode para as setas (testado somente no Firefox, IE e Chrome)
								// Esta condição não utiliza a var 'k', pois o charcode do % e ' é igual ao keycode das setas para a esquerda e direita
								return true;
							} else if((e.keyCode == 35 && e.charCode == 0) || (e.keyCode == 36 && e.charCode == 0)
									|| (e.keyCode == 45 && e.charCode == 0)) {  // end, home e insert 
								return true;
							}
							else { // any other key with keycode less than
										// 48 and greater than 57
								if($.browser.mozilla && k == 118) { // no firefox o ctrl v nao funciona por causa deste script, e como o maskMoney necessita dele,
									return true;   // coloquei esta validacao apenas quando nao utilizarmos nossas mascaras customizadas
								} else {
									preventDefault(e);
								}
								return true;
							}
						} else if (input.val().length >= input.attr('maxlength')) {
							return false;
						} else {
							preventDefault(e);
							if(!settings.maskMoney && input.val().replace(/\D/g, '').length >= settings.mask.replace(/\D/g, '').length) {
								log('input.val().length >= settings.mask.replace(/\D/g,');
								return false;
							} 
							var key = String.fromCharCode(k);
							var x = input.get(0);
							var selection = input.getInputSelection(x);
							var startPos = selection.start;
							var endPos = selection.end;
							x.value = x.value.substring(0, startPos) + key
									+ x.value.substring(endPos, x.value.length);
							maskAndPosition(x, startPos + 1);
							markAsDirty();
							return false;
						}
					}

					function keydownEvent(e) {
						e = e || window.event;
						var k = e.charCode || e.keyCode || e.which;
						
						log('keydown ' +k)
						
						if (k == undefined)
							return false; // needed to handle an IE "special"
											// event
						if (input.attr('readonly') && (k != 13 && k != 9))
							return false; // don't allow editing of readonly
											// fields but allow tab/enter

						var x = input.get(0);
						var selection = input.getInputSelection(x);
						var startPos = selection.start;
						var endPos = selection.end;

						if (k == 8) { // backspace key
							preventDefault(e);

							if (startPos == endPos) {
								// Remove single character
								x.value = x.value.substring(0, startPos - 1)
										+ x.value.substring(endPos,
												x.value.length);
								startPos = startPos - 1;
							} else {
								// Remove multiple characters
								x.value = x.value.substring(0, startPos)
										+ x.value.substring(endPos,
												x.value.length);
							}
							maskAndPosition(x, startPos);
							markAsDirty();
							return false;
						} else if (k == 9) { // tab key
							//alert(dirty)
							if (dirty) {
								if(settings.maskMoney) {
									if(settings.ignoreZeroVal && input.val() == '0,00') { // para ignorar submits de valor 0,00
										input.val('');
										//$(this).change();
									}
								}
//								$(this).change();
//								clearDirt();
							}
							log('keydown event antes do return quando for tab')

							return true;
						} else if(k == 13) {  // enter key (ohta) - por causa do IE nao disparar o change
//							alert($.browser.msie)
							if(settings.maskMoney) {
								if ($.browser.msie && settings.ignoreZeroVal && input.val() == '0,00') { // para ignorar submits de valor 0,00
									input.val('');
									$(this).change();
								}
							}
						} else if (k == 46 || k == 63272) { // delete key (with
															// special case for
															// safari)
							preventDefault(e);
							if (x.selectionStart == x.selectionEnd) {
								// Remove single character
								x.value = x.value.substring(0, startPos)
										+ x.value.substring(endPos + 1,
												x.value.length);
							} else {
								// Remove multiple characters
								x.value = x.value.substring(0, startPos)
										+ x.value.substring(endPos,
												x.value.length);
							}
							maskAndPosition(x, startPos);
							markAsDirty();
							return false;
						} else { // any other key
							return true;
						}
					}

					function focusEvent(e) {
						if(settings.maskMoney) {
							var mask = getDefaultMask();
							if (input.val() == mask) {
								input.val('');
							} else if (input.val() == '' && settings.defaultZero && !input.attr('readonly')) {
								input.val(setSymbol(mask));
							} else {
								input.val(setSymbol(input.val()));
							}
							if (this.createTextRange) {
								var textRange = this.createTextRange();
								textRange.collapse(false); // set the cursor at the
															// end of the input
								textRange.select();
							}
						}
					}

					function blurEvent(e) {
						if ($.browser.msie) {
							keypressEvent(e);
						}

						if (input.val() == ''
								|| input.val() == setSymbol(getDefaultMask())
								|| input.val() == settings.symbol) {
							if (!settings.allowZero)
								input.val('');
							else if (!settings.symbolStay)
								input.val(getDefaultMask());
							else
								input.val(setSymbol(getDefaultMask()));
						} else {
							if (!settings.symbolStay) {
								input.val(input.val().replace(settings.symbol,
										''));
							
							}
							else if (settings.symbolStay
									&& input.val() == settings.symbol) {
								input.val(setSymbol(getDefaultMask()));
							}
						}
						
						if (dirty) {
							clearDirt();
							$(this).change();
						}
					}

					function preventDefault(e) {
						if (e.preventDefault) { // standard browsers
							e.preventDefault();
						} else { // internet explorer
							e.returnValue = false;
						}
					}

					function maskAndPosition(x, startPos) {
						if(settings.maskMoney) {
							var originalLen = input.val().length;
							input.val(maskValue(x.value));
							var newLen = input.val().length;
							startPos = startPos - (originalLen - newLen);
							input.setCursorPosition(startPos);
						} else {
							
						  oCleanedValue = x.value.replace(/\D/g, ''); // remove tudo que for diferente de numero
						  
//						  if(x.value.length != 0 || x.value != undefined) {
							  maskLength = settings.mask.replace(/\D/g, '').length;
							  pMask = getProportionalReverseMask(oCleanedValue, settings.mask);
						  
							  log('valor length - ' + input.val().length);
							  log('valor - ' + input.val());
	
						      oNewValue = applyMask(oCleanedValue, pMask);
						      
						      log('antes do if do maskAndPosition')
//						  }
						      var originalLen = input.val().length;
						      input.val(oNewValue);
	
						      var newLen = input.val().length;
							  startPos = startPos - (originalLen - newLen);
							  
							  log('startPos ' + startPos);
							  log('originalLen ' + originalLen);
							  log('newLen ' + newLen);
							  
							  if(startPos < 0) { // casos em que o input esta completo
								  startPos = newLen;
							  }
							  input.setCursorPosition(startPos);
						  }
//						}
					}

					function maskValue(v) {
						if(settings.maskMoney) {
							v = v.replace(settings.symbol, '');
	
							var strCheck = '0123456789';
							var len = v.length;
							var a = '', t = '', neg = '';
	
							if (len != 0 && v.charAt(0) == '-') {
								v = v.replace('-', '');
								if (settings.allowNegative) {
									neg = '-';
								}
							}
	
							if (len == 0) {
								if (!settings.defaultZero)
									return t;
								if(settings.maskMoney) {
									t = '0.00';
								}
							}
							
							for ( var i = 0; i < len; i++) {
								if ((v.charAt(i) != '0')
										&& (v.charAt(i) != settings.decimal))
									break;
							}
	
							for (; i < len; i++) {
								if (strCheck.indexOf(v.charAt(i)) != -1)
									a += v.charAt(i);
							}
	
	
							parteDecimal = retornaParteFracionariaComPadding(a, settings.precision, 0);
							t = retornaNumeroCompletoComPadding(a, settings.precision, 0);
	
							i = settings.precision == 0 ? 0 : 1;
							var p, d = (t = t.split('.'))[i].substr(0,
									settings.precision);
							
							// variavel d possui todo o valor depois da virgula
							
	//						alert(p + ' ' + d)
							for (p = (t = t[0]).length; (p -= 3) >= 1;) {
								t = t.substr(0, p) + settings.thousands
										+ t.substr(p);
							}
	
	//						alert(t + ','+ parteDecimal)
							if(settings.percent && t > 99){
								t = '100' + settings.decimal;
								for(i = 0; i < settings.precision; i++){
									t  += '0';
								}
								return t;
							}
							
							if(settings.precision == 0) {
								return t;
							}
							else {
								return t + settings.decimal + parteDecimal;
							}
	//						return (settings.precision > 0) ? setSymbol(neg
	//								+ t
	//								+ settings.decimal
	//								+ d
	//								+ Array((settings.precision + 1) - d.length)
	//										.join(0)) : setSymbol(neg + t);
						}
					}

					function mask() {
						var value = input.val();
						input.val(maskValue(value));
					}

					function getDefaultMask() {
						if(settings.maskMoney) {
							var n = parseFloat('0')
									/ Math.pow(10, settings.precision);
							return (n.toFixed(settings.precision)).replace(
									new RegExp('\\.', 'g'), settings.decimal);
						}
					}

					function setSymbol(v) {
						if(settings.maskMoney) {
							if (settings.showSymbol) {
								if (v.substr(0, settings.symbol.length) != settings.symbol)
									return settings.symbol + v;
							}
							return v;
						}
					}

					function changeSign(i) {
						if(settings.maskMoney) {
							if (settings.allowNegative) {
								var vic = i.val();
								if (i.val() != '' && i.val().charAt(0) == '-') {
									return i.val().replace('-', '');
								} else {
									return '-' + i.val();
								}
							} else {
								return i.val();
							}
						}
					}

					input.bind('keypress.maskMoney', keypressEvent);
					input.bind('keydown.maskMoney', keydownEvent);
					input.bind('blur.maskMoney', blurEvent);
					input.bind('focus.maskMoney', focusEvent);
					input.bind('mask', mask);
					
					var pasteEventName = ($.browser.msie ? 'paste.maskMoney drop.maskMoney' : 'input propertychange');
					
					input.bind(pasteEventName,  function() {
//						alert('drasg')
						log(pasteEventName);
						var x = input.get(0);
						setTimeout(function() { maskAndPosition(x, input.val().length); }, 0);
						markAsDirty();
					});
//					
					input.one('unmaskMoney',
							function() {
								input.unbind('.maskMoney');

								if ($.browser.msie) {
									this.onpaste = null;
								} else if ($.browser.mozilla) {
									this.removeEventListener('input',
											blurEvent, false);
								}
							});
				});
	};

	$.fn.unmaskMoney = function() {
		return this.trigger('unmaskMoney');
	};

	$.fn.mask = function() {
		return this.trigger('mask');
	};

	$.fn.setCursorPosition = function(pos) {
		this.each(function(index, elem) {
			if (elem.setSelectionRange) {
				elem.focus();
				elem.setSelectionRange(pos, pos);
			} else if (elem.createTextRange) {
				var range = elem.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		});
		return this;
	};

	$.fn.getInputSelection = function(el) {
		var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

		if (typeof el.selectionStart == "number"
				&& typeof el.selectionEnd == "number") {
			start = el.selectionStart;
			end = el.selectionEnd;
		} else {
			range = document.selection.createRange();

			if (range && range.parentElement() == el) {
				len = el.value.length;
				normalizedValue = el.value.replace(/\r\n/g, "\n");

				// Create a working TextRange that lives only in the input
				textInputRange = el.createTextRange();
				textInputRange.moveToBookmark(range.getBookmark());

				// Check if the start and end of the selection are at the very
				// end
				// of the input, since moveStart/moveEnd doesn't return what we
				// want
				// in those cases
				endRange = el.createTextRange();
				endRange.collapse(false);

				if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
					start = end = len;
				} else {
					start = -textInputRange.moveStart("character", -len);
					start += normalizedValue.slice(0, start).split("\n").length - 1;

					if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
						end = len;
					} else {
						end = -textInputRange.moveEnd("character", -len);
						end += normalizedValue.slice(0, end).split("\n").length - 1;
					}
				}
			}
		}

		return {
			start : start,
			end : end
		};
	};
})(jQuery);


function retornaParteFracionariaComPadding(num, totalChars, padWith) {
	num = num + "";
	padWith = (padWith) ? padWith : "0"; 
	if (num.length < totalChars) {
		while (num.length < totalChars) {
			num = padWith + num;
		}
	} else {}
 
	if (num.length > totalChars) { //if padWith was a multiple character string and num was overpadded
//		num = num.substring(0,(num.length - totalChars)) + '.' + num.substring((num.length - totalChars), totalChars);
		num = num.substring((num.length - totalChars), num.length);
	} 
//	else {
//		num = '0.' + num;
//	}
 
//	alert(num)
	return num; 
}

function retornaNumeroCompletoComPadding(num, totalChars, padWith) {
	num = num + "";
	padWith = (padWith) ? padWith : "0"; 
	if (num.length < totalChars) {
		while (num.length < totalChars) {
			num = padWith + num;
		}
	} else {}
 
	if (num.length > totalChars) { //if padWith was a multiple character string and num was overpadded
		num = num.substring(0,(num.length - totalChars)) + '.' + num.substring((num.length - totalChars), num.length);
//		num = num.substring((num.length - totalChars), num.length);
	} 
	else {
		num = '0.' + num;
	}
 
//	alert(num)
	return num; 
}

var getProportionalReverseMask = function (oValue, Mask) {
    var specialChars = {':': 191, '-': 189, '.': 190, '(': 57, ')': 48, '/': 191, ',': 188, '_': 189, ' ': 32, '+': 187};
    
    var startMask = 0, endMask = 0, m = 0;
    startMask = (Mask.length >= 1) ? Mask.length : Mask.length-1;
    endMask = startMask;

    while (m <= oValue.length-1) {
      while (typeof specialChars[Mask.charAt(endMask-1)] === "number")
        endMask--;
      endMask--;
      m++;
    }

    endMask = (Mask.length >= 1) ? endMask : endMask-1;
    log(Mask.substring(startMask, endMask));
    return Mask.substring(startMask, endMask);
  };
  
  var applyMask = function (fieldObject, Mask) {

	  log('dentro da funcao applyMask ' + fieldObject);
//	 oValue = fieldObject.val().replace(/\W/g, '').substring(0, Mask.replace(/\W/g, '').length);
	 oValue = oCleanedValue.substring(0, Mask.replace(/\D/g, '').length);
	 return oValue.replace(new RegExp(maskToRegex(Mask)), function () {
		 var oNewValue = '';
	     for (var i = 1; i < arguments.length - 2; i++) {
	        if (typeof arguments[i] == "undefined" || arguments[i] === ""){
	          arguments[i] = Mask[i-1];
	        }

	        oNewValue += arguments[i];
	      }
		  log(cleanBullShit(oNewValue, Mask));

	      return cleanBullShit(oNewValue, Mask);
	    });
  };

var maskToRegex = function (mask) {
    var translation = { 0: '(.)', 1: '(.)', 2: '(.)', 3: '(.)', 4: '(.)', 5: '(.)', 6: '(.)', 7: '(.)',
      8: '(.)', 9: '(.)', 'A': '(.)', 'S': '(.)',':': '(:)?', '-': '(-)?', '.': '(\\\.)?', '(': '(\\()?',
      ')': '(\\))?', '/': '(/)?', ',': '(,)?', '_': '(_)?', ' ': '(\\s)?', '+': '(\\\+)?'};

    var regex = '';
    for (var i = 0; i < mask.length; i ++){
      if (translation[mask[i]])
        regex += translation[mask[i]];
    }

    return regex;
  };

  
  var cleanBullShit = function (oNewValue, Mask) {
	    oNewValue = oNewValue.split('');
	    for(var i = 0; i < Mask.length; i++){
	      if(validDigit(Mask.charAt(i), oNewValue[i]) === false)
	        oNewValue[i] = '';
	    }
	    return oNewValue.join('');
};
	  
var validDigit = function (nowMask, nowDigit) {
    var specialChars = {':': 191, '-': 189, '.': 190, '(': 57, ')': 48, '/': 191, ',': 188, '_': 189, ' ': 32, '+': 187};

		    if (isNaN(parseInt(nowMask, 10)) === false && /\d/.test(nowDigit) === false) {
		      return false;
		    } else if (nowMask === 'A' && /[a-zA-Z0-9]/.test(nowDigit) === false) {
		      return false;
		    } else if (nowMask === 'S' && /[a-zA-Z]/.test(nowDigit) === false) {
		      return false;
		    } else if (typeof specialChars[nowDigit] === "number" && nowMask !== nowDigit) {
		      return false;
		    }
		    return true;
		  };