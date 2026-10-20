// Paths normalizados para las máscaras orgánicas de «Nuestra brújula».
// Las coordenadas objectBoundingBox van de 0 a 1 y cada contorno es asimétrico.
export const ORGANIC_SHAPES = Object.freeze({
  blobPrincipal: 'M0.04,0.38 C0.02,0.18 0.20,0.06 0.40,0.07 C0.58,0.08 0.70,0.02 0.84,0.05 C0.94,0.07 0.98,0.16 0.93,0.27 C0.88,0.38 0.96,0.46 0.99,0.58 C1.02,0.72 0.90,0.86 0.72,0.92 C0.52,0.99 0.30,1.00 0.15,0.88 C0.03,0.78 0.06,0.55 0.04,0.38 Z',
  fotoMision: 'M0,0 L0.80,0 C0.92,0.04 1.00,0.16 0.96,0.30 C0.92,0.46 0.82,0.52 0.85,0.68 C0.88,0.82 0.97,0.88 0.92,1 L0,1 Z',
  // Visión usa deliberadamente el mismo contorno B que Misión, como pidió el usuario.
  fotoVision: 'M0,0 L0.80,0 C0.92,0.04 1.00,0.16 0.96,0.30 C0.92,0.46 0.82,0.52 0.85,0.68 C0.88,0.82 0.97,0.88 0.92,1 L0,1 Z',
  fotoMovil: 'M0,0 H1 V0.78 C0.86,0.83 0.99,0.89 0.76,0.94 C0.56,0.99 0.31,0.91 0.14,0.98 C0.08,1 0.02,0.96 0,0.90 Z',
  blobInferiorIzquierdo: 'M0.00,0.28 C0.18,0.18 0.27,0.30 0.35,0.47 C0.43,0.65 0.61,0.62 0.73,0.77 C0.87,0.94 0.67,1 0.43,1 L0,1 Z',
  blobInferiorDerecho: 'M0.06,0.02 C0.28,0.10 0.38,0.00 0.58,0.13 C0.74,0.23 0.72,0.40 0.91,0.47 C1.07,0.54 1.01,0.78 0.84,0.91 C0.66,1.04 0.38,0.88 0.23,0.97 C0.05,1.03 0.02,0.76 0.10,0.58 C0.17,0.40 -0.05,0.22 0.06,0.02 Z',
});
