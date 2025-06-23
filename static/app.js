const ctx = document.getElementById('growthChart');
let chartInstance = null;

// -----------------------------------------------------------------------------
// Función que recibe el JSON de /simulate y dibuja el gráfico
// -----------------------------------------------------------------------------
function renderChart({ t, usuarios, derivada, maxWeek }) {
  // 1) Transformar los arrays en pares {x, y} para usar escala 'linear'
  const dataUsers   = t.map((ti, i) => ({ x: Number(ti), y: usuarios[i] }));
  const dataDeriv   = t.map((ti, i) => ({ x: Number(ti), y: derivada[i] }));

  const data = {
    datasets: [
      {
        label: 'Usuarios acumulados U(t)',
        data: dataUsers,
        borderWidth: 2,
        borderColor: 'rgba(0,120,212,1)',
        backgroundColor: 'rgba(0,120,212,0.08)',
        tension: 0.2,
        pointRadius: 2,
      },
      {
        label: "Tasa de crecimiento U'(t)",
        data: dataDeriv,
        borderWidth: 2,
        borderColor: 'rgba(255,140,0,1)',
        backgroundColor: 'rgba(255,140,0,0.08)',
        tension: 0.2,
        yAxisID: 'y1',
        pointRadius: 2,
      },
    ],
  };

  // 2) Configuración
  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    stacked: false,
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
          callback: (value) => value.toFixed(0),
        },
        title: { display: true, text: 'Semana' },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Usuarios' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Tasa de crecimiento' },
      },
    },
    plugins: {
      legend: { position: 'top' },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: maxWeek,
            xMax: maxWeek,
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              enabled: true,
              content: `Semana ${maxWeek.toFixed(1)}`,
              position: 'start',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
            },
          },
        },
      },
    },
  };

  // 3) Crear o actualizar gráfico
  if (chartInstance) {
    chartInstance.data = data;
    chartInstance.options = options;
    chartInstance.update();
  } else {
    chartInstance = new Chart(ctx, { type: 'line', data, options });
  }

  // 4) Texto de recomendación
  document.getElementById('recommendation').textContent =
    `🔎 Punto de máximo crecimiento: semana ${maxWeek.toFixed(1)}. ` +
    '✅ Recomendación: escalar infraestructura y lanzar campañas justo antes de esta fecha.';
}

// -----------------------------------------------------------------------------
// Función principal: lee inputs, llama a la API y envía a renderChart
// -----------------------------------------------------------------------------
function simulate() {
  const L  = document.getElementById('LInput').value || 10000;
  const k  = document.getElementById('kInput').value || 0.8;
  const t0 = document.getElementById('t0Input').value || 5;

  fetch(`/simulate?L=${L}&k=${k}&t0=${t0}`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(renderChart)
    .catch((err) => alert('Error al obtener datos: ' + err));
}

// -----------------------------------------------------------------------------
// Inicialización
// -----------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', simulate);
document.getElementById('simulateBtn').addEventListener('click', simulate);
