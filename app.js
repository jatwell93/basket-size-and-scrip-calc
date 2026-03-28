// ── Animation helpers ────────────────────────────────────────────

// Count up a numeric value displayed via a formatter function
function animateValue(el, target, formatter) {
  var start = performance.now();
  var duration = 650;
  function tick(now) {
    var p = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - p, 4); // ease-out-quart
    el.textContent = formatter(target * eased);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = formatter(target);
  }
  requestAnimationFrame(tick);
}

// Show a results panel; animate it in if it was hidden. Returns true on first reveal.
function revealResults(id) {
  var el = document.getElementById(id);
  var wasHidden = el.style.display !== 'block';
  if (wasHidden) {
    el.style.display = 'block';
    el.classList.add('results-reveal');
  }
  return wasHidden;
}

// Add stagger entrance animation to all rows in a tbody
function staggerRows(tbody) {
  tbody.querySelectorAll('tr').forEach(function(row, i) {
    row.style.animationDelay = (i * 55) + 'ms';
    row.classList.add('row-animate');
  });
}

// Flash a value element with a teal glow to signal it changed
function flashValue(el) {
  el.classList.remove('value-flash');
  void el.offsetWidth; // force reflow so animation replays
  el.classList.add('value-flash');
}

// Shake an input horizontally to signal a validation error
function shakeInput(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('input-shake');
  void el.offsetWidth;
  el.classList.add('input-shake');
  el.addEventListener('animationend', function() {
    el.classList.remove('input-shake');
  }, { once: true });
}

// ────────────────────────────────────────────────────────────────

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
  Object.keys(tabs).forEach((key) => {
    const tabEl = tabs[key];
    if (tabEl) tabEl.classList.remove("active");
    
    // Update ARIA on corresponding button
    const btn = Array.from(buttons).find(b => b.dataset.tab === key);
    if (btn) {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    }
  });

  // Show selected tab and activate corresponding button
  if (tabs[tab]) {
    tabs[tab].classList.add("active");
    const activeBtn = Array.from(buttons).find(b => b.dataset.tab === tab);
    if (activeBtn) {
      activeBtn.classList.add("active");
      activeBtn.setAttribute("aria-selected", "true");
    }
  }
}

// FAQ accordion functionality — JS height animation for accurate easing
function toggleFaq(index) {
  const faqItems = document.querySelectorAll(".faq-item");
  const question = faqItems[index].querySelector(".faq-question");
  const answer = faqItems[index].querySelector(".faq-answer");
  const isActive = question.classList.contains("active");

  if (isActive) {
    // Collapse: lock height then animate to 0
    answer.style.height = answer.scrollHeight + "px";
    answer.offsetHeight; // force reflow
    answer.style.height = "0px";
    question.classList.remove("active");
    question.setAttribute("aria-expanded", "false");
    answer.addEventListener("transitionend", function handler() {
      answer.classList.remove("active");
      answer.removeEventListener("transitionend", handler);
    }, { once: true });
  } else {
    // Expand: measure target height then animate from 0
    answer.classList.add("active");
    const targetH = answer.scrollHeight + "px";
    answer.style.height = "0px";
    answer.offsetHeight; // force reflow
    answer.style.height = targetH;
    question.classList.add("active");
    question.setAttribute("aria-expanded", "true");
    answer.addEventListener("transitionend", function handler() {
      answer.style.height = "auto"; // allow natural resize after animation
      answer.removeEventListener("transitionend", handler);
    }, { once: true });
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
  
  // Reset aria-invalid
  ["numTransactions", "currentAvgBasket", "currentGpPercentage"].forEach(id => {
    document.getElementById(id).setAttribute("aria-invalid", "false");
  });

  const numTransactionsInput = document.getElementById("numTransactions");
  const currentAvgBasketInput = document.getElementById("currentAvgBasket");
  const currentGpPercentageInput = document.getElementById("currentGpPercentage");

  const numTransactions = parseFloat(numTransactionsInput.value);
  const currentAvgBasket = parseFloat(currentAvgBasketInput.value);
  const currentGpPercent = parseFloat(currentGpPercentageInput.value) / 100;

  if (!validateInput(numTransactions, 1)) {
    document.getElementById("error-numTransactions").textContent =
      "Please enter a valid number of transactions";
    numTransactionsInput.setAttribute("aria-invalid", "true");
    shakeInput("numTransactions");
    return;
  }
  if (!validateInput(currentAvgBasket, 0.01)) {
    document.getElementById("error-currentAvgBasket").textContent =
      "Please enter a valid basket value";
    currentAvgBasketInput.setAttribute("aria-invalid", "true");
    shakeInput("currentAvgBasket");
    return;
  }
  if (!validateInput(currentGpPercent * 100, 0)) {
    document.getElementById("error-currentGpPercentage").textContent =
      "Please enter a valid GP percentage";
    currentGpPercentageInput.setAttribute("aria-invalid", "true");
    shakeInput("currentGpPercentage");
    return;
  }

  const currentWeeklySales = numTransactions * currentAvgBasket;
  const currentWeeklyProfit = currentWeeklySales * currentGpPercent;

  const salesEl = document.getElementById("currentWeeklySales");
  const profitEl = document.getElementById("currentWeeklyProfit");

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

  // Callout the highest-increment row (best opportunity)
  var topRow = tbody.lastElementChild;
  if (topRow) topRow.classList.add('basket-top-row');

  const firstReveal = revealResults("basketResults");
  if (firstReveal) {
    staggerRows(tbody);
    animateValue(salesEl, currentWeeklySales, formatCurrency);
    animateValue(profitEl, currentWeeklyProfit, formatCurrency);
  } else {
    salesEl.textContent = formatCurrency(currentWeeklySales);
    profitEl.textContent = formatCurrency(currentWeeklyProfit);
    flashValue(salesEl);
    flashValue(profitEl);
  }
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

  revealResults("customBasketResults");
  staggerRows(tbody);

  // Callout the yearly row (highest impact period)
  var yearlyRow = tbody.lastElementChild;
  if (yearlyRow) yearlyRow.classList.add('yearly-row');
}

// SCRIPT SOLUTIONS CALCULATOR
function calculateScriptGrowth() {
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));

  // Reset aria-invalid
  ["weeklyScriptTrans", "scriptPlusOther", "avgOtcValue", "scriptGpPercent"].forEach(id => {
    document.getElementById(id).setAttribute("aria-invalid", "false");
  });

  const weeklyScriptTransInput = document.getElementById("weeklyScriptTrans");
  const scriptPlusOtherInput = document.getElementById("scriptPlusOther");
  const avgOtcValueInput = document.getElementById("avgOtcValue");
  const scriptGpPercentInput = document.getElementById("scriptGpPercent");

  const weeklyScriptTrans = parseFloat(weeklyScriptTransInput.value);
  const scriptPlusOther = parseFloat(scriptPlusOtherInput.value);
  const avgOtcValue = parseFloat(avgOtcValueInput.value);
  const scriptGpPercent = parseFloat(scriptGpPercentInput.value) / 100;

  // Validate inputs
  if (!validateInput(weeklyScriptTrans, 1)) {
    document.getElementById("error-weeklyScriptTrans").textContent = "Please enter valid transactions";
    shakeInput("weeklyScriptTrans");
    return;
  }
  if (!validateInput(scriptPlusOther, 0)) {
    document.getElementById("error-scriptPlusOther").textContent = "Please enter valid transactions";
    shakeInput("scriptPlusOther");
    return;
  }
  if (!validateInput(avgOtcValue, 0.01)) {
    document.getElementById("error-avgOtcValue").textContent = "Please enter valid OTC value";
    shakeInput("avgOtcValue");
    return;
  }
  if (!validateInput(scriptGpPercent * 100, 0)) {
    document.getElementById("error-scriptGpPercent").textContent = "Please enter valid GP percentage";
    shakeInput("scriptGpPercent");
    return;
  }

  // Calculate current state
  const currentScriptSolutionPercent = (scriptPlusOther / weeklyScriptTrans) * 100;

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
  const summaryTable = document.getElementById("scriptScenarioTable");
  if (summaryTable) summaryTable.innerHTML = "";

  const scenarios = [
    { increase: 2, id: "2" },
    { increase: 4, id: "4" },
    { increase: 6, id: "6" }
  ];

  scenarios.forEach((scenario) => {
    const results = calculateScenarioData(
      weeklyScriptTrans,
      scriptPlusOther,
      currentScriptSolutionPercent,
      scenario.increase,
      avgOtcValue,
      scriptGpPercent
    );

    // Update the mini-table in the scenario card
    const miniTable = document.getElementById(`scenario${scenario.id}Weekly`);
    if (miniTable) {
        miniTable.innerHTML = `
            <div class="space-y-1 text-sm">
                <div class="flex justify-between"><span class="text-gray-500">Target Trans:</span> <span class="font-semibold">${formatNumber(results.weekly.proposedTrans)}</span></div>
                <div class="flex justify-between"><span class="text-gray-500">Weekly Sales:</span> <span class="font-semibold text-teal-700">${formatCurrency(results.weekly.incrementalSales)}</span></div>
            </div>
        `;
    }

    // Update the impact span
    const impactSpan = document.getElementById(`yearlyProfit${scenario.id}`);
    if (impactSpan) {
        impactSpan.textContent = formatCurrency(results.yearly.incrementalProfit);
        flashValue(impactSpan);
    }

    // Add to summary table if it exists
    if (summaryTable) {
        const row = summaryTable.insertRow();
        row.innerHTML = `
            <td class="font-medium">+${scenario.increase}%</td>
            <td class="number">${formatPercent(results.proposedPercent)}</td>
            <td class="number">${formatCurrency(results.weekly.incrementalSales)}</td>
            <td class="number">${formatCurrency(results.monthly.incrementalProfit)}</td>
            <td class="number font-bold text-teal-700">${formatCurrency(results.yearly.incrementalProfit)}</td>
        `;
    }
  });

  // Update note
  document.getElementById("avgValueNote").textContent = avgOtcValue.toFixed(2);

  const firstScriptReveal = revealResults("scriptResults");
  if (firstScriptReveal) {
    document.getElementById("scriptResults").scrollIntoView({ behavior: "smooth" });
    if (summaryTable) staggerRows(summaryTable);
  }
}

function calculateScenarioData(
  weeklyScriptTrans,
  currentScriptPlusOther,
  currentPercent,
  increasePercent,
  avgOtcValue,
  gpPercent
) {
  const proposedPercent = currentPercent + increasePercent;

  function getPeriodData(multiplier) {
    const periodScriptTrans = weeklyScriptTrans * multiplier;
    const proposedTrans = Math.round(periodScriptTrans * (proposedPercent / 100));
    const currentTrans = currentScriptPlusOther * multiplier;
    const additionalTrans = proposedTrans - currentTrans;
    const incrementalSales = additionalTrans * avgOtcValue;
    const incrementalProfit = incrementalSales * gpPercent;
    return { proposedTrans, incrementalSales, incrementalProfit };
  }

  return {
    proposedPercent,
    weekly: getPeriodData(1),
    monthly: getPeriodData(4),
    yearly: getPeriodData(52)
  };
}

function calculateCustomScript() {
  const weeklyScriptTrans = parseFloat(document.getElementById("weeklyScriptTrans").value);
  const scriptPlusOther = parseFloat(document.getElementById("scriptPlusOther").value);
  const avgOtcValue = parseFloat(document.getElementById("avgOtcValue").value);
  const scriptGpPercent = parseFloat(document.getElementById("scriptGpPercent").value) / 100;
  const targetPercent = parseFloat(document.getElementById("targetScriptPercent").value);

  if (!validateInput(targetPercent, 0)) {
    alert("Please enter a valid target percentage");
    return;
  }

  const currentPercent = (scriptPlusOther / weeklyScriptTrans) * 100;
  const absoluteTargetIncrease = targetPercent - currentPercent;
  
  const finalResults = calculateScenarioData(
    weeklyScriptTrans,
    scriptPlusOther,
    currentPercent,
    absoluteTargetIncrease,
    avgOtcValue,
    scriptGpPercent
  );

  const tbody = document.getElementById("customScriptTable");
  tbody.innerHTML = "";

  const periods = [
    { name: "Weekly", data: finalResults.weekly },
    { name: "Monthly (4 weeks)", data: finalResults.monthly },
    { name: "Yearly (52 weeks)", data: finalResults.yearly },
  ];

  periods.forEach((p) => {
    const row = tbody.insertRow();
    row.innerHTML = `
        <td class="font-medium">${p.name}</td>
        <td class="number">${formatCurrency(p.data.incrementalSales)}</td>
        <td class="number font-bold text-teal-700">${formatCurrency(p.data.incrementalProfit)}</td>
    `;
  });

  revealResults("customScriptResults");
  staggerRows(tbody);
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

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('pharmiq-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pharmiq-theme', newTheme);
  });
}
