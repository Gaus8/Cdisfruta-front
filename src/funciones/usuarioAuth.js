import { apiAxios } from "./conexion";

/**
 * Inicia sesión con credenciales de email y contraseña.
 * @param {Object} credentials - Objeto con { email, password }
 * @returns {Promise<Object>} Datos de respuesta del servidor (token, rol, etc.)
 */

export const iniciarSesion = async (credentials) => {
  try {
    const res = await apiAxios.post('/login', credentials);
    if (res.status === 200) {
      sessionStorage.setItem('token', res.data.token);
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

/**
 * Registra un nuevo usuario en la aplicación.
 */
export const registrarUsuario = async (data, terminos) => {
  try {
    const payload = { ...data, terminosAceptados: terminos };
    const response = await apiAxios.post('/registro', payload);
    return response;
  } catch (err) {
    throw err.response?.data || { message: "Error al registrar el usuario." };
  }
};