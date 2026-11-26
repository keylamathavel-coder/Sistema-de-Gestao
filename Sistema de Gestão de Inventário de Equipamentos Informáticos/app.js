const formulario = document.getElementById("formulario");

// Verifica a ligação à base de dados sem alterar a interface principal.
const estadoConexao = document.createElement("div");
estadoConexao.id = "estadoConexao";
estadoConexao.style.cssText = "padding:10px;margin:12px 0;border-radius:5px;font-weight:bold;";
formulario.parentNode.insertBefore(estadoConexao, formulario);

fetch("php/status.php")
    .then(resposta => resposta.json())
    .then(resultado => {
        estadoConexao.textContent = resultado.mensagem;
        estadoConexao.style.background = resultado.sucesso ? "#d1fae5" : "#fee2e2";
        estadoConexao.style.color = resultado.sucesso ? "#065f46" : "#991b1b";
    })
    .catch(() => {
        estadoConexao.textContent = "Não foi possível comunicar com o servidor ou com a base de dados.";
        estadoConexao.style.background = "#fee2e2";
        estadoConexao.style.color = "#991b1b";
    });

let idEmEdicao = null;
// Devolve a data de hoje (hora local) no formato AAAA-MM-DD; "dias" soma dias à data de hoje
function dataDeHoje(dias = 0) {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mes + "-" + dia;
}

// Mostra o campo "Data de abate" só quando o estado é "Abatido"
function atualizarCampoAbate() {
    const campoAbate = document.getElementById("dataAbate");
    const abatido = document.getElementById("estado").value === "Abatido";
    campoAbate.parentElement.style.display = abatido ? "" : "none";
    if (!abatido) {
        campoAbate.value = "";
    }
}
document.getElementById("estado").addEventListener("change", atualizarCampoAbate);
atualizarCampoAbate();

// Validar os dados quando o formulário for enviado
formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    const erros = [];

    // Obter os valores dos campos
    let codigo = document.getElementById("codigo").value.trim();
    let tipo = document.getElementById("tipo").value;
    let marca = document.getElementById("marca").value.trim();
    let modelo = document.getElementById("modelo").value.trim();
    let serie = document.getElementById("serie").value.trim();
    let departamento = document.getElementById("departamento").value;
    let utilizador = document.getElementById("utilizador").value.trim();
    let dataAquisicao = document.getElementById("dataAquisicao").value;
    let dataGarantia = document.getElementById("dataGarantia").value;
    let estado = document.getElementById("estado").value;
    let valor = document.getElementById("valor").value;
    let dataAbate = document.getElementById("dataAbate").value;
    let observacoes = document.getElementById("observacoes").value.trim();

    // 1. Código patrimonial: obrigatório e formato INV-0001 (o único é verificado no PHP)
    if (codigo === "") {
        erros.push("O código patrimonial é obrigatório.");
    } else if (!/^INV-\d{4}$/.test(codigo)) {
        erros.push("O código deve ter o formato INV-0001.");
    }

    // 2. Tipo de equipamento: obrigatório
    if (tipo === "") {
        erros.push("Selecione um tipo de equipamento.");
    }

    // 3. Marca: obrigatória
    if (marca === "") {
        erros.push("A marca é obrigatória.");
    }

    // 4. Modelo: obrigatório
    if (modelo === "") {
        erros.push("O modelo é obrigatório.");
    }

    // 5. N.º de série: obrigatório (o único é verificado no PHP)
    if (serie === "") {
        erros.push("O número de série é obrigatório.");
    }

    // 6. Departamento: obrigatório
    if (departamento === "") {
        erros.push("Selecione um departamento.");
    }

    // 7. Utilizador: só letras; obrigatório se o estado for "Em uso"
    if (estado === "Em uso" && utilizador === "") {
        erros.push("O utilizador responsável é obrigatório quando o estado é Em uso.");
    } else if (utilizador !== "" && !/^[A-Za-zÀ-ÿ\s]+$/.test(utilizador)) {
        erros.push("O utilizador deve conter apenas letras.");
    }

    // 8. Data de aquisição: obrigatória e não pode ser futura
    if (dataAquisicao === "") {
        erros.push("A data de aquisição é obrigatória.");
    } else if (dataAquisicao > dataDeHoje()) {
        erros.push("A data de aquisição não pode ser futura.");
    }

    // 9. Valor de aquisição: obrigatório e maior ou igual a 0
    if (valor === "") {
        erros.push("O valor de aquisição é obrigatório.");
    } else if (isNaN(valor) || parseFloat(valor) < 0) {
        erros.push("O valor de aquisição deve ser um número maior ou igual a 0.");
    }

    // 10. Garantia: opcional; se preenchida tem de ser posterior à aquisição (não pode ser igual nem anterior)
    if (dataGarantia !== "" && dataAquisicao !== "" && dataGarantia <= dataAquisicao) {
        erros.push("A data de garantia tem de ser posterior à data de aquisição.");
    }

    // 11. Estado: obrigatório
    if (estado === "") {
        erros.push("Selecione o estado do equipamento.");
    }

    // 12. Data de abate: obrigatória quando o estado é "Abatido"
    if (estado === "Abatido" && dataAbate === "") {
        erros.push("A data de abate é obrigatória quando o estado é Abatido.");
    }

    // 13. Observações: máximo 300 caracteres
    if (observacoes.length > 300) {
        erros.push("As observações não podem ter mais de 300 caracteres.");
    }

    // Apresentar mensagens
    let mensagens = document.getElementById("mensagens");
    if (erros.length > 0) {
        mensagens.style.color = "red";
        mensagens.textContent = erros.join("\n");
        mensagens.scrollIntoView({ behavior: "smooth" });
    } else {
        const dados = {
            id: idEmEdicao, codigo, tipo, marca, modelo, serie, departamento, utilizador,
            dataAquisicao, valor, dataGarantia, estado, dataAbate, observacoes
        };
        const url = idEmEdicao ? "php/editar.php" : "php/guardar.php";

        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
            .then(resposta => resposta.json())
            .then(resultado => {

                if (resultado.sucesso) {
                    mensagens.style.color = "green";
                    mensagens.textContent = resultado.mensagem;
                    idEmEdicao = null;

                    document.getElementById("validarBtn").textContent = "Registar Equipamentos";
                    formulario.reset();
                    atualizarCampoAbate();
                   window.location.href = "Lista de Equipamentos.html"; 
                } else {
                    mensagens.style.color = "red";
                    mensagens.textContent = resultado.mensagem;
                    mensagens.scrollIntoView({ behavior: "smooth" });
                }
            })
            .catch(function () {
                mensagens.style.color = "red";
                mensagens.textContent = "Não foi possível comunicar com o servidor.";
            });
    }
});

// Copia o equipamento escolhido para o formulário e entra em modo de edição
function editarEquipamento(e) {
    idEmEdicao = e.id;

    document.getElementById("codigo").value = e.codigo;
    document.getElementById("tipo").value = e.tipo;
    document.getElementById("marca").value = e.marca;
    document.getElementById("modelo").value = e.modelo;
    document.getElementById("serie").value = e.serie;
    document.getElementById("departamento").value = e.departamento;
    document.getElementById("utilizador").value = e.utilizador || "";
    document.getElementById("dataAquisicao").value = e.data_aquisicao || "";
    document.getElementById("valor").value = e.valor;
    document.getElementById("dataGarantia").value = e.data_garantia || "";
    document.getElementById("estado").value = e.estado;
    document.getElementById("dataAbate").value = e.data_abate || "";
    document.getElementById("observacoes").value = e.observacoes || "";

    atualizarCampoAbate();
    document.getElementById("validarBtn").textContent = "Guardar alterações";
    formulario.scrollIntoView({ behavior: "smooth" });
}

// Se vier da página Lista (index.html?editar=ID), carrega esse equipamento no formulário
function carregarEdicaoDaURL() {
    const id = new URLSearchParams(window.location.search).get("editar");
    if (id === null) {
        return;
    }
    fetch("php/listar.php")
        .then(resposta => resposta.json())
        .then(resultado => {
            const equipamento = resultado.equipamentos.find(function (e) {
                return String(e.id) === id;
            });
            if (equipamento) {
                editarEquipamento(equipamento);
            }
        })
        .catch(function () {
            document.getElementById("mensagens").textContent = "Não foi possível carregar o equipamento para edição.";
        });
}
carregarEdicaoDaURL();