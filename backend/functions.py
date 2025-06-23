import numpy as np

def crecimiento_usuarios(t, L=10000, k=0.8, t0=5):
    """Función logística que modela el número acumulado de usuarios."""
    return L / (1 + np.exp(-k * (t - t0)))

def tasa_crecimiento(t, L=10000, k=0.8, t0=5):
    """Derivada de la función logística: usuarios añadidos por unidad de tiempo."""
    exp_term = np.exp(-k * (t - t0))
    return (L * k * exp_term) / (1 + exp_term) ** 2
