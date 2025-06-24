from flask import Flask, request, jsonify, render_template
import numpy as np

# Importa tus funciones de dominio
from functions import crecimiento_usuarios, tasa_crecimiento

# ---------------------------------------------------------------------------
# Configuración base de Flask
# ---------------------------------------------------------------------------
app = Flask(
    __name__,
    static_folder="../static",      # JS y CSS
    template_folder="../templates"   # HTML
)

# ---------------------------------------------------------------------------
# Rutas
# ---------------------------------------------------------------------------
@app.route("/")
def home():
    """Devuelve la página principal"""
    return render_template("index.html")


@app.route("/simulate")
def simulate():
    """Endpoint que calcula la curva logística y su derivada.

    Query‑string esperada (todas opcionales, con valores por defecto):
        /simulate?L=8000&k=1.2&t0=6
    """
    # 1) Leer parámetros
    L = float(request.args.get("L", 10000))
    k = float(request.args.get("k", 0.8))
    t0 = float(request.args.get("t0", 5))

    # 2) Calcular rango de tiempo con paso fijo de 0.1
    t = np.arange(0, 10.1, 0.1)  # 0.0, 0.1, … 10.0 (101 puntos)

    # 3) Modelar
    usuarios = crecimiento_usuarios(t, L, k, t0)
    derivada = tasa_crecimiento(t, L, k, t0)

    # 4) Máximo de la derivada → punto de inflexión
    max_idx = int(np.argmax(derivada))
    max_week = round(float(t[max_idx]), 1)  # Ej: 6.0

    # 5) Respuesta JSON serializable
    return jsonify({
        "t": t.tolist(),
        "usuarios": usuarios.tolist(),
        "derivada": derivada.tolist(),
        "maxWeek": max_week,
    })


# ---------------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
