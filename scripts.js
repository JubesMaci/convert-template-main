const API_KEY = "5ce953db4eb127cd1de5fed1";

const form = document.querySelector("form");
const amount = document.getElementById("amount");
const selectCurrency = document.getElementById("currency");
const footer = document.querySelector("main footer");
const description = document.getElementById("description");
const result = document.getElementById("result");

// Manipulando o input amount para receber somente números.
amount.addEventListener("input", () => {
  const hasCharactersRegex = /\D+/g;
  amount.value = amount.value.replace(hasCharactersRegex, "");
});

// Captando o evento de submit (enviar) do formulário.
form.onsubmit = (event) => {
  event.preventDefault();

  const userCurrency = selectCurrency.value;

  fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${userCurrency}`)
    .then((response) => response.json())
    .then((data) => {
      convertCurrency(amount.value, data.conversion_rates.BRL, userCurrency);
    });

  // switch (selectCurrency.value) {
  //   case "USD":
  //     fetch(
  //       "https://v6.exchangerate-api.com/v6/5ce953db4eb127cd1de5fed1/latest/USD"
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         convertCurrency(amount.value, data.conversion_rates.BRL, "US$");
  //       });

  //     break;
  //   case "EUR":
  //     fetch(
  //       "https://v6.exchangerate-api.com/v6/5ce953db4eb127cd1de5fed1/latest/EUR"
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         convertCurrency(amount.value, data.conversion_rates.BRL, "€");
  //       });
  //     break;
  //   case "GBP":
  //     fetch(
  //       "https://v6.exchangerate-api.com/v6/5ce953db4eb127cd1de5fed1/latest/GBP"
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         convertCurrency(amount.value, data.conversion_rates.BRL, "£");
  //       });
  //     break;
  // }
};
// Função para converter a moeda
function convertCurrency(amount, price, symbol) {
  try {
    // Exibindo a cotação da moeda selecionada
    description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price)}`;

    // Calcula o total
    let total = amount * price;

    if (isNaN(total)) {
      return alert("Por favor, digite o valor corretamente para o conversor");
    }

    total = formatCurrencyBRL(total).replace("R$", "");
    result.textContent = `${total} Reais`;

    // Aplica a classe do footer removendo ele da tela.
    footer.classList.add("show-result");
  } catch (error) {
    console.log(error);
    footer.classList.remove("show-result");
    // Remove a classe do footer removendo ele da tela.
    alert("Não foi possível converter. Tente novamente mais tarde");
  }
}

// Formata a moeda em para real brasileiro
function formatCurrencyBRL(value) {
  // Converte para número para utiizar o toLocaleString para formatar no padrão BRL(R$00,00)
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// carregar lista de opções
function onLoad() {
  fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`)
    .then((res) => res.json())
    .then((data) => addCurrencyOptions(data.supported_codes));
}

// adicionar as opções no elemento 'select'
function addCurrencyOptions(supportedCodes) {
  if (supportedCodes.length === 0) {
    return;
  }

  for (const code of supportedCodes) {
    const option = document.createElement("option");
    option.value = code[0];
    option.innerHTML = code[1];
    selectCurrency.appendChild(option);
  }
}

// vai executar quando a página carregar
onLoad();
