/*Função  Pai de Mascaras*/
function Mascara(o, f) {
	v_obj = o
	v_fun = f
	setTimeout("execmascara()", 1)
}

/* Função que Executa os objetos */
function execmascara() {
	v_obj.value = v_fun(v_obj.value)
}

/* Função que Determina as expressões regulares dos objetos */
function leech(v) {
	v = v.replace(/o/gi, "0")
	v = v.replace(/i/gi, "1")
	v = v.replace(/z/gi, "2")
	v = v.replace(/e/gi, "3")
	v = v.replace(/a/gi, "4")
	v = v.replace(/s/gi, "5")
	v = v.replace(/t/gi, "7")
	return v
}

/* Função que permite apenas numeros */
function Integer(v) {
	return v.replace(/\D/g, "")
}

/* Função que padroniza telefone (11) 4184-1241 */
function Telefone(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/^(\d\d)(\d)/g, "($1) $2")
	v = v.replace(/(\d{4})(\d)/, "$1-$2")
	return v
}

/* Função que padroniza telefone (11) 41841241 */
function TelefoneCall(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/^(\d\d)(\d)/g, "($1) $2")
	return v
}

/* Função que padroniza CPF */
function Cpf(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/(\d{3})(\d)/, "$1.$2")
	v = v.replace(/(\d{3})(\d)/, "$1.$2")

	v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
	return v
}

/* Função que padroniza CEP */
function Cep(v) {
	v = v.replace(/D/g, "")
	v = v.replace(/^(\d{5})(\d)/, "$1-$2")
	return v
}

/* Função que padroniza CNPJ */
function Cnpj(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/^(\d{2})(\d)/, "$1.$2")
	v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
	v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
	v = v.replace(/(\d{4})(\d)/, "$1-$2")
	return v
}

/* Função que permite apenas numeros Romanos */
function Romanos(v) {
	v = v.toUpperCase()
	v = v.replace(/[^IVXLCDM]/g, "")

	while (v.replace(
			/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/, "") != "")
		v = v.replace(/.$/, "")
	return v
}

/* Função que padroniza o Site */
function Site(v) {
	v = v.replace(/^http:\/\/?/, "")
	dominio = v
	caminho = ""
	if (v.indexOf("/") > -1)
		dominio = v.split("/")[0]
	caminho = v.replace(/[^\/]*/, "")
	dominio = dominio.replace(/[^\w\.\+-:@]/g, "")
	caminho = caminho.replace(/[^\w\d\+-@:\?&=%\(\)\.]/g, "")
	caminho = caminho.replace(/([\?&])=/, "$1")
	if (caminho != "")
		dominio = dominio.replace(/\.+$/, "")
	v = "http://" + dominio + caminho
	return v
}

/* Função que padroniza DATA */
function Data(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/(\d{2})(\d)/, "$1/$2")
	v = v.replace(/(\d{2})(\d)/, "$1/$2")
	
	if (v.length > 10)
		v = v.substring(0, 10);
	
	return v
}

/* Função que padroniza DATA */
function Hora(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/(\d{2})(\d)/, "$1:$2")
	return v
}

/* Função que padroniza valor monétario */
function Valor(v) {
	v = v.replace(/\D/g, "") // Remove tudo o que não é dígito
	v = v.replace(/(\d)(\d{17})$/,"$1.$2")
	v = v.replace(/(\d)(\d{14})$/,"$1.$2")
	v = v.replace(/(\d)(\d{11})$/,"$1.$2")
	v = v.replace(/(\d)(\d{8})$/,"$1.$2")
	v = v.replace(/(\d)(\d{5})$/,"$1.$2")
	v = v.replace(/(\d)(\d{2})$/,"$1,$2")
	return v
}

/* Função que padroniza Area */
function Area(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/(\d)(\d{2})$/, "$1.$2")
	return v
}

/* Função que padroniza valor monétario em geral*/
function mascara_dinheiro(v) {
	textoNumerico = v.replace(/\D/g, "");
	textoNumerico = textoNumerico.replace(/^0/, "")
	textoFormatado = "";
	if (textoNumerico.length == 1) {
		return "0,0" + textoNumerico;
	} else if (textoNumerico.length == 2) {
		return "0," + textoNumerico;
	} else {
		for (i = 0; i < textoNumerico.length; i++) {
			if (i == textoNumerico.length - 2) {
				textoFormatado += ",";
			}
			if ((i != 0 && textoNumerico.length - i >= 5)
					&& ((textoNumerico.length - i + 1) % 3 == 0)) {
				textoFormatado += ".";
			}
			textoFormatado += textoNumerico.charAt(i);
		}
		return textoFormatado;
	}
}

/* Função para não deixar inserir mais de um determinado N° de caracteres no textarea */
function limitText(limitField, limitNum) {
    if (limitField.value.length > limitNum) {
        limitField.value = limitField.value.substring(0, limitNum);
        return false;
    }
    return true;
}
