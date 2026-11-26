// Garantias que terminam dentro deste número de dias ficam a laranja
const DIAS_AVISO_GARANTIA = 30;

// Devolve a data de hoje (hora local) no formato AAAA-MM-DD.
// O parâmetro "dias" soma dias à data de hoje (ex.: dataDeHoje(30) = daqui a 30 dias).
function dataDeHoje(dias = 0) {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mes + "-" + dia;
}

// Diz em que situação está a garantia. 
function estadoGarantia(dataGarantia) {
    if (!dataGarantia) {
        return "sem-garantia";
    }
    if (dataGarantia < dataDeHoje()) {
        return "expirada";
    }
    if (dataGarantia <= dataDeHoje(DIAS_AVISO_GARANTIA)) {
        return "a-expirar";
    }
    return "valida";
}

// Converte AAAA-MM-DD em DD/MM/AAAA (devolve "—" se não houver data)
function formatarData(data) {
    return data ? data.split("-").reverse().join("/") : "—";
}

// Converte "AAAA-MM-DD HH:MM:SS" (vem assim da base de dados) em "DD/MM/AAAA HH:MM"
function formatarDataHora(dataHora) {
    if (!dataHora) {
        return "—";
    }
    const partes = dataHora.split(" ");
    return formatarData(partes[0]) + " " + partes[1].substring(0, 5);
}