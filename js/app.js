class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }
  //verifica se o registro esta todo preenchido
  validaDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

//Adiciona os registros em localStorage
class BancoDeDados {
  constructor() {
    let id = localStorage.getItem("id");
    if (id == null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }

  gravar(despesa) {
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(despesa));

    localStorage.setItem("id", id);
  }

  recuperaRegistros() {
    let despesas = Array();
    let id = localStorage.getItem("id");

    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));
      if (despesa == null) {
        continue;
      }
      despesas.push(despesa);
    }

    return despesas;
  }
}
let Bd = new BancoDeDados();

function cadastrarDespesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );
  if (despesa.validaDados()) {
    Bd.gravar(despesa);

    //alert modal -> sucesso
    document.getElementById("modal_titulo_div").className =
      "modal-header text-success";
    document.getElementById("modal_titulo").innerHTML =
      "Cadastro inserido com sucesso";
    document.getElementById("modal_descricao").innerHTML =
      "Despesa cadastrada com sucesso!";
    document.getElementById("modal_button").className = "btn btn-success";
    document.getElementById("modal_button").innerHTML = "Voltar";

    $("#modalRegistroDespesa").modal("show");

    ano.value = "";
    mes.value = "";
    dia.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";
  } else {
    //alert modal -> erro
    document.getElementById("modal_titulo").innerHTML = "Erro!";
    document.getElementById("modal_titulo_div").className =
      "modal-header text-danger";
    document.getElementById("modal_descricao").innerHTML =
      "Erro na gravação, verifique se todos os campos foram preenchidos corretamente.";
    document.getElementById("modal_button").innerHTML = "Voltar e corrigir";
    document.getElementById("modal_button").className = "btn btn-danger";

    $("#modalRegistroDespesa").modal("show");
  }
}

function recuperaDespesas() {
  let despesas = Array();
  despesas = Bd.recuperaRegistros();

  let listaDespesas = document.getElementById("listaDespesas");

  despesas.forEach(function (d) {
    let linha = listaDespesas.insertRow();
    linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`;
    switch (d.tipo) {
      case "1":
        d.tipo = "Alimentação";
        break;
      case "2":
        d.tipo = "Educação";
        break;
      case "3":
        d.tipo = "Lazer";
        break;
      case "4":
        d.tipo = "Saúde";
        break;
      case "5":
        d.tipo = "transporte";
        break;
    }
    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = `R$${d.valor}`;
  });
}
