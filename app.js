// Tab switching
function switchTab(tab) {
  // Get all tabs and buttons
  const tabs = {
    basket: document.getElementById("basket-tab"),
    script: document.getElementById("script-tab"),
    faq: document.getElementById("faq-tab"),
  };
  const buttons = document.querySelectorAll(".tab-button");

  // Hide all tabs and deactivate all buttons
  Object.values(tabs).forEach((tabEl) => {
    if (tabEl) tabEl.classList.remove("active");
  });
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Show selected tab and activate corresponding button
  if (tabs[tab]) {
    tabs[tab].classList.add("active");
    const buttonIndex = tab === "basket" ? 0 : tab === "script" ? 1 : 2;
    buttons[buttonIndex].classList.add("active");
  }
}

// FAQ accordion functionality
function toggleFaq(index) {
  const faqItems = document.querySelectorAll(".faq-item");
  const question = faqItems[index].querySelector(".faq-question");
  const answer = faqItems[index].querySelector(".faq-answer");

  const isActive = answer.classList.contains("active");

  // Toggle the clicked FAQ
  if (isActive) {
    question.classList.remove("active");
    answer.classList.remove("active");
  } else {
    question.classList.add("active");
    answer.classList.add("active");
  }
}

// Format currency
function formatCurrency(value) {
  return value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  });
}

// Format percentage
function formatPercent(value) {
  return value.toFixed(2) + "%";
}

// Format number
function formatNumber(value) {
  return Math.round(value).toLocaleString();
}

// Validate input
function validateInput(value, min = 0) {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min;
}

// BASKET SIZE CALCULATOR
function calculateBasketGrowth() {
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));

  const numTransactions = parseFloat(
    document.getElementById("numTransactions").value,
  );
  const currentAvgBasket = parseFloat(
    document.getElementById("currentAvgBasket").value,
  );
  const currentGpPercent =
    parseFloat(document.getElementById("currentGpPercentage").value) / 100;

  if (!validateInput(numTransactions, 1)) {
    document.getElementById("error-numTransactions").textContent =
      "Please enter a valid number of transactions";
    return;
  }
  if (!validateInput(currentAvgBasket, 0.01)) {
    document.getElementById("error-currentAvgBasket").textContent =
      "Please enter a valid basket value";
    return;
  }
  if (!validateInput(currentGpPercent * 100, 0)) {
    document.getElementById("error-currentGpPercentage").textContent =
      "Please enter a valid GP percentage";
    return;
  }

  const currentWeeklySales = numTransactions * currentAvgBasket;
  const currentWeeklyProfit = currentWeeklySales * currentGpPercent;

  document.getElementById("currentWeeklySales").textContent =
    formatCurrency(currentWeeklySales);
  document.getElementById("currentWeeklyProfit").textContent =
    formatCurrency(currentWeeklyProfit);

  const increments = [1, 1.5, 2, 2.5, 3];
  const tbody = document.getElementById("basketIncrementTable");
  tbody.innerHTML = "";

  increments.forEach((increment) => {
    const weeklyIncrease = numTransactions * increment;
    const monthlyIncrease = weeklyIncrease * 4;
    const yearlyIncrease = weeklyIncrease * 52;

    const row = tbody.insertRow();
    row.innerHTML = `
                            <td class="font-medium">+${formatCurrency(increment)}</td>
                            <td class="number">${formatCurrency(weeklyIncrease)}</td>
                            <td class="number">${formatCurrency(monthlyIncrease)}</td>
                            <td class="number">${formatCurrency(yearlyIncrease)}</td>
                        `;
  });

  document.getElementById("basketResults").style.display = "block";
}

function calculateCustomBasket() {
  const numTransactions = parseFloat(
    document.getElementById("numTransactions").value,
  );
  const currentAvgBasket = parseFloat(
    document.getElementById("currentAvgBasket").value,
  );
  const currentGpPercent =
    parseFloat(document.getElementById("currentGpPercentage").value) / 100;
  const targetAvgBasket = parseFloat(
    document.getElementById("targetAvgBasket").value,
  );
  const targetGpPercent =
    parseFloat(document.getElementById("targetGpPercentage").value) / 100;

  if (!validateInput(targetAvgBasket, 0)) {
    alert("Please enter a valid target basket value");
    return;
  }
  if (!validateInput(targetGpPercent * 100, 0)) {
    alert("Please enter a valid target GP percentage");
    return;
  }

  const currentWeeklySales = numTransactions * currentAvgBasket;
  const currentWeeklyProfit = currentWeeklySales * currentGpPercent;
  const targetWeeklySales = numTransactions * targetAvgBasket;
  const targetWeeklyProfit = targetWeeklySales * targetGpPercent;

  const weeklyIncrementalSales = targetWeeklySales - currentWeeklySales;
  const weeklyIncrementalProfit = targetWeeklyProfit - currentWeeklyProfit;

  const tbody = document.getElementById("customBasketTable");
  tbody.innerHTML = "";

  const periods = [
    { name: "Weekly", multiplier: 1 },
    { name: "Monthly (4 weeks)", multiplier: 4 },
    { name: "Yearly (52 weeks)", multiplier: 52 },
  ];

  periods.forEach((period) => {
    const row = tbody.insertRow();
    row.innerHTML = `
                            <td class="font-medium">${period.name}</td>
                            <td class="number">${formatCurrency(weeklyIncrementalSales * period.multiplier)}</td>
                            <td class="number">${formatCurrency(weeklyIncrementalProfit * period.multiplier)}</td>
                        `;
  });

  document.getElementById("customBasketResults").style.display = "block";
}

// SCRIPT SOLUTIONS CALCULATOR
function calculateScriptGrowth() {
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));

  const weeklyScriptTrans = parseFloat(
    document.getElementById("weeklyScriptTrans").value,
  );
  const scriptPlusOther = parseFloat(
    document.getElementById("scriptPlusOther").value,
  );
  const avgOtcValue = parseFloat(document.getElementById("avgOtcValue").value);
  const scriptGpPercent =
    parseFloat(document.getElementById("scriptGpPercent").value) / 100;

  // Validate inputs
  if (!validateInput(weeklyScriptTrans, 1)) {
    document.getElementById("error-weeklyScriptTrans").textContent =
      "Please enter valid transactions";
    return;
  }
  if (!validateInput(scriptPlusOther, 0)) {
    document.getElementById("error-scriptPlusOther").textContent =
      "Please enter valid transactions";
    return;
  }
  if (!validateInput(avgOtcValue, 0.01)) {
    document.getElementById("error-avgOtcValue").textContent =
      "Please enter valid OTC value";
    return;
  }
  if (!validateInput(scriptGpPercent * 100, 0)) {
    document.getElementById("error-scriptGpPercent").textContent =
      "Please enter valid GP percentage";
    return;
  }

  // Calculate current state
  const currentScriptSolutionPercent =
    (scriptPlusOther / weeklyScriptTrans) * 100;

  // Display current state
  const currentStateTable = document.getElementById("currentStateTable");
  currentStateTable.innerHTML = `
                        <tr>
                            <td class="number">${formatNumber(weeklyScriptTrans)}</td>
                            <td class="number">${formatNumber(scriptPlusOther)}</td>
                            <td class="number">${formatPercent(currentScriptSolutionPercent)}</td>
                            <td class="number">${formatPercent(scriptGpPercent * 100)}</td>
                        </tr>
                    `;

  // Calculate scenarios
  const scenarios = [
    {
      increase: 2,
      weeklyId: "scenario2Weekly",
      monthlyId: "scenario2Monthly",
      yearlyId: "scenario2Yearly",
    },
    {
      increase: 4,
      weeklyId: "scenario4Weekly",
      monthlyId: "scenario4Monthly",
      yearlyId: "scenario4Yearly",
    },
    {
      increase: 6,
      weeklyId: "scenario6Weekly",
      monthlyId: "scenario6Monthly",
      yearlyId: "scenario6Yearly",
    },
  ];

  scenarios.forEach((scenario) => {
    calculateScenario(
      weeklyScriptTrans,
      scriptPlusOther,
      currentScriptSolutionPercent,
      scenario.increase,
      avgOtcValue,
      scriptGpPercent,
      scenario.weeklyId,
      scenario.monthlyId,
      scenario.yearlyId,
    );
  });

  // Update note
  document.getElementById("avgValueNote").textContent = avgOtcValue.toFixed(2);

  document.getElementById("scriptResults").style.display = "block";
  document
    .getElementById("scriptResults")
    .scrollIntoView({ behavior: "smooth" });
}

function calculateScenario(
  weeklyScriptTrans,
  currentScriptPlusOther,
  currentPercent,
  increasePercent,
  avgOtcValue,
  gpPercent,
  weeklyId,
  monthlyId,
  yearlyId,
) {
  const proposedPercent = currentPercent + increasePercent;

  // Weekly calculations
  const weeklyProposedTrans = Math.round(
    weeklyScriptTrans * (proposedPercent / 100),
  );
  const weeklyAdditionalTrans = weeklyProposedTrans - currentScriptPlusOther;
  const weeklyIncrementalSales = weeklyAdditionalTrans * avgOtcValue;
  const weeklyIncrementalProfit = weeklyIncrementalSales * gpPercent;

  // Monthly calculations (4 weeks)
  const monthlyScriptTrans = weeklyScriptTrans * 4;
  const monthlyProposedTrans = Math.round(
    monthlyScriptTrans * (proposedPercent / 100),
  );
  const monthlyCurrentTrans = currentScriptPlusOther * 4;
  const monthlyAdditionalTrans = monthlyProposedTrans - monthlyCurrentTrans;
  const monthlyIncrementalSales = monthlyAdditionalTrans * avgOtcValue;
  const monthlyIncrementalProfit = monthlyIncrementalSales * gpPercent;

  // Yearly calculations (52 weeks)
  const yearlyScriptTrans = weeklyScriptTrans * 52;
  const yearlyProposedTrans = Math.round(
    yearlyScriptTrans * (proposedPercent / 100),
  );
  const yearlyCurrentTrans = currentScriptPlusOther * 52;
  const yearlyAdditionalTrans = yearlyProposedTrans - yearlyCurrentTrans;
  const yearlyIncrementalSales = yearlyAdditionalTrans * avgOtcValue;
  const yearlyIncrementalProfit = yearlyIncrementalSales * gpPercent;

  // Populate weekly table
  const weeklyTable = document.getElementById(weeklyId);
  weeklyTable.innerHTML = `
                        <tr>
                            <td class="number">${formatNumber(weeklyScriptTrans)}</td>
                            <td class="number">${formatNumber(weeklyProposedTrans)}</td>
                            <td class="number">${formatPercent(proposedPercent)}</td>
                            <td class="number">${formatCurrency(weeklyIncrementalSales)}</td>
                            <td class="number">${formatCurrency(weeklyIncrementalProfit)}</td>
                        </tr>
                    `;

  // Populate monthly table
  const monthlyTable = document.getElementById(monthlyId);
  monthlyTable.innerHTML = `
                        <tr>
                            <td class="number">${formatNumber(monthlyScriptTrans)}</td>
                            <td class="number">${formatNumber(monthlyProposedTrans)}</td>
                            <td class="number">${formatPercent(proposedPercent)}</td>
                            <td class="number">${formatCurrency(monthlyIncrementalSales)}</td>
                            <td class="number">${formatCurrency(monthlyIncrementalProfit)}</td>
                        </tr>
                    `;

  // Populate yearly table
  const yearlyTable = document.getElementById(yearlyId);
  yearlyTable.innerHTML = `
                        <tr>
                            <td class="number">${formatNumber(yearlyScriptTrans)}</td>
                            <td class="number">${formatNumber(yearlyProposedTrans)}</td>
                            <td class="number">${formatPercent(proposedPercent)}</td>
                            <td class="number">${formatCurrency(yearlyIncrementalSales)}</td>
                            <td class="number">${formatCurrency(yearlyIncrementalProfit)}</td>
                        </tr>
                    `;
}

function calculateCustomScript() {
  const weeklyScriptTrans = parseFloat(
    document.getElementById("weeklyScriptTrans").value,
  );
  const scriptPlusOther = parseFloat(
    document.getElementById("scriptPlusOther").value,
  );
  const avgOtcValue = parseFloat(document.getElementById("avgOtcValue").value);
  const scriptGpPercent =
    parseFloat(document.getElementById("scriptGpPercent").value) / 100;
  const targetPercent = parseFloat(
    document.getElementById("targetScriptPercent").value,
  );

  if (!validateInput(targetPercent, 0)) {
    alert("Please enter a valid target percentage");
    return;
  }
  

  // Weekly calculations
  const weeklyProposedTrans = Math.round(
    weeklyScriptTrans * (targetPercent / 100),
  );
  const weeklyAdditionalTrans = weeklyProposedTrans - scriptPlusOther;
  const weeklyIncrementalSales = weeklyAdditionalTrans * avgOtcValue;
  const weeklyIncrementalProfit = weeklyIncrementalSales * scriptGpPercent;

  // Monthly calculations (4 weeks)
  const monthlyScriptTrans = weeklyScriptTrans * 4;
  const monthlyProposedTrans = Math.round(
    monthlyScriptTrans * (targetPercent / 100),
  );
  const monthlyCurrentTrans = scriptPlusOther * 4;
  const monthlyAdditionalTrans = monthlyProposedTrans - monthlyCurrentTrans;
  const monthlyIncrementalSales = monthlyAdditionalTrans * avgOtcValue;
  const monthlyIncrementalProfit = monthlyIncrementalSales * scriptGpPercent;

  // Yearly calculations (52 weeks)
  const yearlyScriptTrans = weeklyScriptTrans * 52;
  const yearlyProposedTrans = Math.round(
    yearlyScriptTrans * (targetPercent / 100),
  );
  const yearlyCurrentTrans = scriptPlusOther * 52;
  const yearlyAdditionalTrans = yearlyProposedTrans - yearlyCurrentTrans;
  const yearlyIncrementalSales = yearlyAdditionalTrans * avgOtcValue;
  const yearlyIncrementalProfit = yearlyIncrementalSales * scriptGpPercent;

  // Populate weekly custom table
  const weeklyTable = document.getElementById("customWeeklyTable");
  weeklyTable.innerHTML = `
                        <tr>
                            <td class="number">${formatNumber(weeklyScriptTrans)}</td>
                            <td class="number">${formatNumber(weeklyProposedTrans)}</td>
                            <td class="number">${formatPercent(targetPercent)}</td>
                            <td class="number">${formatCurrency(weeklyIncrementalSales)}</td>
                            <td class="number">${formatCurrency(weeklyIncrementalProfit)}</td>
                        </tr>
                    `;

  // Populate monthly custom table
  const monthlyTable = document.getElementById("customMonthlyTable");
  monthlyTable.innerHTML = `
                        <tr>
                            <td class="number">${formatNumber(monthlyScriptTrans)}</td>
                            <td class="number">${formatNumber(monthlyProposedTrans)}</td>
                            <td class="number">${formatPercent(targetPercent)}</td>
                            <td class="number">${formatCurrency(monthlyIncrementalSales)}</td>
                            <td class="number">${formatCurrency(monthlyIncrementalProfit)}</td>
                        </tr>
                    `;

  // Populate yearly custom table
  const yearlyTable = document.getElementById("customYearlyTable");
  yearlyTable.innerHTML = `
                        <tr>
                            <td class="number">${formatNumber(yearlyScriptTrans)}</td>
                            <td class="number">${formatNumber(yearlyProposedTrans)}</td>
                            <td class="number">${formatPercent(targetPercent)}</td>
                            <td class="number">${formatCurrency(yearlyIncrementalSales)}</td>
                            <td class="number">${formatCurrency(yearlyIncrementalProfit)}</td>
                        </tr>
                    `;

  document.getElementById("customScriptResults").style.display = "block";
  document
    .getElementById("customScriptResults")
    .scrollIntoView({ behavior: "smooth" });
}

// Auto-calculate on input change for basket calculator
["numTransactions", "currentAvgBasket", "currentGpPercentage"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    if (document.getElementById("basketResults").style.display === "block") {
      calculateBasketGrowth();
    }
  });
});

// Auto-calculate on input change for script calculator
[
  "weeklyScriptTrans",
  "scriptPlusOther",
  "avgOtcValue",
  "scriptGpPercent",
].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => {
    if (document.getElementById("scriptResults").style.display === "block") {
      calculateScriptGrowth();
    }
  });
});

// Expose functions to window (fallback) and attach event listeners
if (typeof window !== "undefined") {
  // Fallback global references (keeps backwards compatibility)
  window.switchTab = switchTab;
  window.toggleFaq = toggleFaq;
  window.calculateBasketGrowth = calculateBasketGrowth;
  window.calculateCustomBasket = calculateCustomBasket;
  window.calculateScriptGrowth = calculateScriptGrowth;
  window.calculateCustomScript = calculateCustomScript;

  // Tab buttons (use data-tab attribute)
  document.querySelectorAll('.tab-button[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Calculator buttons
  document.getElementById('btnCalculateBasket')?.addEventListener('click', calculateBasketGrowth);
  document.getElementById('btnCalculateCustomBasket')?.addEventListener('click', calculateCustomBasket);
  document.getElementById('btnCalculateScript')?.addEventListener('click', calculateScriptGrowth);
  document.getElementById('btnCalculateCustomScript')?.addEventListener('click', calculateCustomScript);

  // FAQ accordion: attach by index order
  document.querySelectorAll('.faq-question').forEach((q, i) => {
    q.addEventListener('click', () => toggleFaq(i));
  });
}
