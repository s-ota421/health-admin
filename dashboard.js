if (
  sessionStorage.getItem("adminLogin")
  !== "true"
) {

  location.href = "login.html";

}

const isLogin =
  sessionStorage.getItem("adminLogin");

if (isLogin !== "true") {

  location.href = "login.html";

}

const ctx =
  document
    .getElementById('healthChart')
    .getContext("2d");

const monthSelect =
  document.getElementById("monthSelect");

const today = new Date();
Chart.register(ChartDataLabels); 
const symptomCtx = document
  .getElementById('symptomChart')
  .getContext('2d');

const symptomChart = new Chart(symptomCtx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384', '#FF9F40', '#FFCD56',
        '#4BC0C0', '#9966FF', '#C9CBCF',
        '#36A2EB', '#FF6B6B', '#A8E6CF'
      ]
    }]
  },
options: {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#fff',          // 文字色（白）
        font: {
          size: 13,
          weight: 'bold'        // 太字
        },
        formatter: (value, context) => {
          const label =
            context.chart.data.labels[context.dataIndex];
          return `${label}\n${value}件`;
          // 例：「頭痛
          //       2件」
        }
      },
      legend: {
        position: 'right',
        labels: { font: { size: 13 } }
      },
      title: {
        display: true,
        text: '症状の内訳（当月）',
        font: { size: 15 }
      }
    }
  }
});
monthSelect.value =
  today.getFullYear()
  + "-"
  + String(today.getMonth() + 1)
      .padStart(2,"0");
const chart = new Chart(ctx, {

  type: 'line',

  data: {

    labels: [],
    datasets: [
      {
        label: '体調',
        data: [],
        borderColor: 'red',
        backgroundColor: 'transparent',
        borderWidth: 1,       // 線を細く
        pointRadius: 1,         // 点を小さく
        tension: 0.3
      },
      {
        label: 'メンタル',
        data: [],
        borderColor: 'blue',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 1,
        tension: 0.3
      },
      {
        label: '睡眠',
        data: [],
        borderColor: 'green',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 1,
        tension: 0.3
      }
    ]
  },

  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 5,
          boxHeight: 5,
          font: {
            size: 14
          }
        }
      }
    },
    scales: {
      y: {
        min: 1,
        max: 10
      }
    }
  }
});

 async function loadUsers() {

  const response = await fetch(
  `${GAS_URL}?type=users`
);

  const users = await response.json();

  const select = document.getElementById("userSelect");

  users.forEach(user => {

    const option = document.createElement("option");

    option.value = user.id;
    option.textContent = user.name;
    select.appendChild(option);

  });
}

loadUsers();

const userSelect =
  document.getElementById("userSelect");

userSelect.addEventListener(

  "change",

  async () => {

    const userId = userSelect.value;

    if(!userId) return;

   const month =
  document.getElementById("monthSelect").value;

   const response = await fetch(

  `${GAS_URL}?type=monthly&userId=${userId}&month=${month}`

   );

    const records =
      await response.json();

    console.log(records);

   const labels = records.map(r => {

   const d = new Date(r.date);

  return d.getDate() + "日";

});
    // データ取得

    const physical = records.map(r =>
      Number(r.physical)
    );
    const mental = records.map(r =>
      Number(r.mental)
    );
    const sleep = records.map(r =>
      Number(r.sleep)
    );

    // グラフ更新

    chart.data.labels = labels;
    chart.data.datasets[0].data =
      physical;
    chart.data.datasets[1].data =
      mental;
    chart.data.datasets[2].data =
      sleep;

      console.log(labels);
console.log(physical);
console.log(mental);
console.log(sleep);
console.log(chart.data);

    chart.update();
   updateSymptomChart(records); 
  }
);
/* =====================================
   症状円グラフ更新
===================================== */

function updateSymptomChart(records) {
  const counts = {};

  records.forEach(r => {
    const symptom = r.symptom?.trim();
    if (!symptom) return;
    counts[symptom] = (counts[symptom] || 0) + 1;
  });

  symptomChart.data.labels = Object.keys(counts);
  symptomChart.data.datasets[0].data = Object.values(counts);
  symptomChart.update();
}

/* =====================================
   体調不良者・未入力者を表示
===================================== */

async function loadAlertAndMissing() {

  // 体調不良者
  const alertRes = await fetch(`${GAS_URL}?type=alert`);
  const alerts = await alertRes.json();

  const alertList = document.getElementById("alertList");

  if (alerts.length === 0) {
    alertList.textContent = "該当者なし";
  } else {
    alertList.innerHTML = alerts.map(u =>
      `<div class="alert-item">
        ${u.name}
        <span class="badge">
          体調${u.physical} / メンタル${u.mental} / 睡眠${u.sleep}
        </span>
      </div>`
    ).join("");
  }

  // 未入力者
  const missingRes = await fetch(`${GAS_URL}?type=missing`);
  const missing = await missingRes.json();

  const missingList = document.getElementById("missingList");

 if (!Array.isArray(missing)) {
    missingList.textContent = "集計時間外（15:30〜16:00）";
  } else if (missing.length === 0) {
    missingList.textContent = "全員入力済み";
  } else {
    missingList.innerHTML = missing.map(u =>
      `<div class="missing-item">${u.name}</div>`
    ).join("");
  }
}

loadAlertAndMissing();

let interviewMode = false;

function toggleInterviewMode() {

  const layout =
    document.getElementById("layout");

  const sidebar =
    document.getElementById("sidebar");

  const btn =
    document.getElementById("modeBtn");

  interviewMode = !interviewMode;

  if (interviewMode) {

    sidebar.style.display = "none";

    layout.classList.add("interview");

    btn.textContent = "通常表示";

  } else {

    sidebar.style.display = "block";

    layout.classList.remove("interview");

    btn.textContent = "面談モード";

  }
  setTimeout(() => {

    chart.resize();

  }, 300);
}

function logout() {

  sessionStorage.removeItem(
    "adminLogin"
  );

  sessionStorage.removeItem(
    "adminName"
  );

  location.href = "login.html";
}
