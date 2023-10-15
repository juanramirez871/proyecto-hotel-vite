const baseUrl = "http://localhost:5173";

/**
 * @param {string} selector - Selector CSS para el elemento a seleccionar.
 * @returns {HTMLElement | null} - El elemento seleccionado o null si no se encontró ningún elemento.
 */

import { hotelApi } from "../api";

const $ = (element) => document.querySelector(element);
const $btnIniciar = $("#btn-iniciar");

$btnIniciar.addEventListener("click", async (e = event) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target.form));
  try {
    const authRes = await hotelApi.post("/auth/login", formData);
    const { token, user } = authRes.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = `${baseUrl}/index.html`;
  } catch (error) {
    console.log(error);
  }
});
