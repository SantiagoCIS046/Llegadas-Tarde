import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ============ HUELLA ============

/**
 * Registrar huella dactilar de un estudiante
 * @param {string} cedula - Cédula del estudiante
 * @returns {Promise} Resultado del registro
 */
export async function registrarHuella(cedula) {
  try {
    // 1. Obtener opciones de registro del servidor
    const { data: optionsResponse } = await axios.post(
      `${API_URL}/webauthn/huella/registro/opciones`,
      { cedula }
    );

    if (!optionsResponse.success) {
      throw new Error(optionsResponse.message);
    }

    const options = optionsResponse.data;

    // 2. Iniciar registro con WebAuthn
    const attestation = await startRegistration(options);

    // 3. Enviar attestation al servidor para verificar
    const { data: verifyResponse } = await axios.post(
      `${API_URL}/webauthn/huella/registro/verificar`,
      { cedula, attestation }
    );

    return verifyResponse;
  } catch (error) {
    console.error("Error registrando huella:", error);
    throw error;
  }
}

/**
 * Autenticar con huella y crear registro de llegada
 * @param {string} cedula - Cédula del estudiante
 * @param {string} dispositivo - Información del dispositivo
 * @returns {Promise} Resultado del registro de llegada
 */
export async function autenticarConHuella(cedula, dispositivo) {
  try {
    // 1. Obtener opciones de autenticación
    const { data: optionsResponse } = await axios.post(
      `${API_URL}/webauthn/huella/autenticacion/opciones`,
      { cedula }
    );

    if (!optionsResponse.success) {
      throw new Error(optionsResponse.message);
    }

    const options = optionsResponse.data;

    // 2. Iniciar autenticación con WebAuthn
    const assertion = await startAuthentication(options);

    // 3. Enviar assertion al servidor para verificar y crear registro
    const { data: verifyResponse } = await axios.post(
      `${API_URL}/webauthn/huella/autenticacion/verificar`,
      { cedula, assertion, dispositivo }
    );

    return verifyResponse;
  } catch (error) {
    console.error("Error autenticando con huella:", error);
    throw error;
  }
}

// ============ FACE ID ============

/**
 * Registrar Face ID de un estudiante
 * @param {string} cedula - Cédula del estudiante
 * @returns {Promise} Resultado del registro
 */
export async function registrarFaceId(cedula) {
  try {
    // 1. Obtener opciones de registro del servidor
    const { data: optionsResponse } = await axios.post(
      `${API_URL}/webauthn/faceid/registro/opciones`,
      { cedula }
    );

    if (!optionsResponse.success) {
      throw new Error(optionsResponse.message);
    }

    const options = optionsResponse.data;

    // 2. Iniciar registro con WebAuthn
    const attestation = await startRegistration(options);

    // 3. Enviar attestation al servidor para verificar
    const { data: verifyResponse } = await axios.post(
      `${API_URL}/webauthn/faceid/registro/verificar`,
      { cedula, attestation }
    );

    return verifyResponse;
  } catch (error) {
    console.error("Error registrando Face ID:", error);
    throw error;
  }
}

/**
 * Autenticar con Face ID y crear registro de llegada
 * @param {string} cedula - Cédula del estudiante
 * @param {string} dispositivo - Información del dispositivo
 * @returns {Promise} Resultado del registro de llegada
 */
export async function autenticarConFaceId(cedula, dispositivo) {
  try {
    // 1. Obtener opciones de autenticación
    const { data: optionsResponse } = await axios.post(
      `${API_URL}/webauthn/faceid/autenticacion/opciones`,
      { cedula }
    );

    if (!optionsResponse.success) {
      throw new Error(optionsResponse.message);
    }

    const options = optionsResponse.data;

    // 2. Iniciar autenticación con WebAuthn
    const assertion = await startAuthentication(options);

    // 3. Enviar assertion al servidor para verificar y crear registro
    const { data: verifyResponse } = await axios.post(
      `${API_URL}/webauthn/faceid/autenticacion/verificar`,
      { cedula, assertion, dispositivo }
    );

    return verifyResponse;
  } catch (error) {
    console.error("Error autenticando con Face ID:", error);
    throw error;
  }
}

/**
 * Verificar si el navegador soporta WebAuthn
 * @returns {boolean} true si soporta WebAuthn
 */
export function soportaWebAuthn() {
  return (
    window.PublicKeyCredential !== undefined &&
    navigator.credentials !== undefined
  );
}

