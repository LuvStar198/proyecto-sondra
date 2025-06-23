from flask import Flask, request, jsonify, render_template
import numpy as np
from functions import crecimiento_usuarios, tasa_crecimiento

# ---- Configuración básica ---------------------------------------------------------
app = Flask(
    __name__,
    static_folder="../static",      # Aquí están app.js y styles.css
    template_folder="../templates"  # Aquí vive index.html
)

# --------- Rutas----------------------------------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/simulate")
def simulate():

    # 1) Recibir parámetros (con valores por defecto)
    L  = float(request.args.get("L", 10000))
    k  = float(request.args.get("k", 0.8))
    t0 = float(request.args.get("t0", 5))

    # 2) Cálculo
    t        = np.linspace(0, 10, 100)
    usuarios = crecimiento_usuarios(t, L, k, t0)
    derivada = tasa_crecimiento(t, L, k, t0)
    max_idx  = int(np.argmax(derivada))
    max_week = float(t[max_idx])

    # 3) Respuesta JSON
    return jsonify({
        "t":        t.tolist(),
        "usuarios": usuarios.tolist(),
        "derivada": derivada.tolist(),
        "maxWeek":  max_week
    })


# ----------------------------------------------------------------------
# Ejecución directa
# ----------------------------------------------------------------------
if __name__ == "__main__":
    # debug=True recarga automático en cambios y muestra tracebacks útiles
    app.run(debug=True)
