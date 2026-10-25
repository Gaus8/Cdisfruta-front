import { apiAxios } from "./client";

/**
 * Inicia sesión con credenciales de email y contraseña.
 * @param {Object} credentials - Objeto con { email, password }
 * @returns {Promise<Object>} Datos de respuesta del servidor (rol, usuario, etc.)
 */
export const iniciarSesion = async (credentials) => {
  try {
    const res = await apiAxios.post('/auth/login', credentials);
    if (res.status === 200) {
      // La cookie httpOnly se guarda automáticamente vía apiAxios (withCredentials: true)
      return res.data;
    }
  } catch (err) {
    const message = err.response?.data?.message || "Error al iniciar sesión.";
    throw new Error(message);
  }
};

export const procesarErroresRegistro = (errorData) => {
  let nuevosErrores = { s1: "", s2: "", s3: "" };

  // Errores de formato (Zod)
  if (errorData?.error && Array.isArray(errorData.error)) {
    errorData.error.forEach((e) => {
      if (e.message === "error1") {
        nuevosErrores.s1 = "Mínimo 6 letras (solo caracteres alfabéticos).";
      } else if (e.message === "error2") {
        nuevosErrores.s2 = "Ingresa un correo electrónico válido (ej. usuario@dominio.com).";
      } else if (e.message === "error3") {
        nuevosErrores.s3 = "Debe tener 8-16 caracteres, una mayúscula, una minúscula, un número y un símbolo (.!@#$%^&*).";
      }
    });
  } 
  // Errores del servidor/negocio
  else if (errorData?.message) {
    if (errorData.message.includes("CORREO YA REGISTRADO")) {
      nuevosErrores.s2 = "Este correo electrónico ya se encuentra registrado.";
    } else {
      alert(errorData.message);
    }
  }

  return nuevosErrores;
};

export const registrarUsuario = async (data, terminos) => {
  try {
    const payload = { ...data, terminosAceptados: terminos };
    const response = await apiAxios.post('/auth/registro', payload);
    return response;
  } catch (err) {
    throw err.response?.data || { message: "Error al registrar el usuario." };
  }
};

export const loginConGoogle = async (credential) => {
  try {
    const res = await apiAxios.post('/auth/google', { credential });
    if (res.status === 200 && res.data) return res.data;
    throw new Error('Google confirmó la cuenta, pero la aplicación no pudo abrir la sesión.');
  } catch (err) {
    const message = err.response?.data?.message || err.message || "Error al iniciar sesión con Google.";
    throw new Error(message);
  }
};

export const solicitarRestablecerPassword = async (email) => {
  try {
    const response = await apiAxios.post('/auth/codigo-password', { email });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al enviar la solicitud." };
  }
};

export const restablecerPasswordConToken = async ({ token, nuevaPassword }) => {
  try {
    const response = await apiAxios.post('/auth/reset-password', { token, nuevaPassword });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al actualizar la contraseña." };
  }
};

export const cambiarPassword = async (passActual, nuevaPassword) => {
  try {
    const response = await apiAxios.patch('/auth/cambiar-password', { 
      passActual, 
      nuevaPassword 
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al actualizar la contraseña." };
  }
};

export const actualizarPerfil = async (payload) => {
  try {
    // FormData (con foto): Axios pone multipart + boundary solo.
    // Objeto plano (solo nombre/teléfono/avatar URL): JSON, más fiable en Vercel.
    const response = await apiAxios.patch('/auth/actualizar-perfil', payload);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al actualizar el perfil." };
  }
};

const asError = (err, fallback) => {
  const message = err?.response?.data?.message || err?.message || fallback;
  return Object.assign(new Error(message), { status: err?.response?.status });
};

export const listarDireccionesEnvio = async () => {
  try {
    const response = await apiAxios.get('/auth/direcciones-envio');
    return response.data;
  } catch (err) {
    throw asError(err, 'Error al cargar las direcciones.');
  }
};

export const crearDireccionEnvio = async (payload) => {
  try {
    const response = await apiAxios.post('/auth/direcciones-envio', payload);
    return response.data;
  } catch (err) {
    throw asError(err, 'Error al guardar la dirección.');
  }
};

export const eliminarDireccionEnvio = async (id) => {
  try {
    const response = await apiAxios.delete(`/auth/direcciones-envio/${id}`);
    return response.data;
  } catch (err) {
    throw asError(err, 'Error al eliminar la dirección.');
  }
};