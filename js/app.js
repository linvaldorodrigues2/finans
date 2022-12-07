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
      despesa.id = i;
      despesas.push(despesa);
    }

    return despesas;
  }

  pesquisar(despesa) {
    let filtraDespesas = Array();
    filtraDespesas = this.recuperaRegistros();
    console.log(filtraDespesas);
    //ano
    if (despesa.ano != "") {
      filtraDespesas = filtraDespesas.filter((d) => d.ano == despesa.ano);
    }
    //mes
    if (despesa.mes != "") {
      filtraDespesas = filtraDespesas.filter((d) => d.mes == despesa.mes);
    }
    //dia
    if (despesa.dia != "") {
      filtraDespesas = filtraDespesas.filter((d) => d.dia == despesa.dia);
    }
    //tipo
    if (despesa.tipo != "") {
      filtraDespesas = filtraDespesas.filter((d) => d.tipo == despesa.tipo);
    }
    //descrição
    if (despesa.descricao != "") {
      filtraDespesas = filtraDespesas.filter(
        (d) => d.descricao == despesa.descricao
      );
    }
    //valor
    if (despesa.valor != "") {
      filtraDespesas = filtraDespesas.filter((d) => d.valor == despesa.valor);
    }

    console.log(filtraDespesas);
    return filtraDespesas;
  }

  removerDespesa(id) {
    localStorage.removeItem(id);
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

function recuperaDespesas(despesas = Array(), filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = Bd.recuperaRegistros();
  }

  let listaDespesas = document.getElementById("listaDespesas");
  listaDespesas.innerHTML = "";

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

    //botão excluir despesa
    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `id_despesa_${d.id}`;

    btn.onclick = function () {
      let id = this.id.replace("id_despesa_", "");
      Bd.removerDespesa(id);
      window.location.reload();
    };

    linha.insertCell(4).append(btn);
  });
}

function filtrarDespesa() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

  let despesas = Bd.pesquisar(despesa);

  recuperaDespesas(despesas, true);
}
