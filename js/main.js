import { Calendar } from "fullcalendar";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import bootstrap5Plugn from "@fullcalendar/bootstrap5";
const $btnReservar = document.querySelector("#btnReservar");

import "./reserva";
import { hotelApi } from "./api";
import { reservar } from "./reserva";

const getReservations = async () => {
  const { data } = await hotelApi.get("reservations/?limit=100", {
    params: { state: "checkIn" },
  });

  return data.data.reservation.map((el) => {
    const color = el.state === "checkIn" ? "#FFA67D" : "#F2D20C";
    const host = el.host.name;
    const dateIn = el.dateEntry;
    const dateExit = new Date(el.dateOutput);
    const nexExit = dateExit.setHours(dateExit.getHours() + 10);

    return {
      title: "🧙‍♂️ room " + el.roomNumber + " - " + host,
      start: dateIn,
      end: nexExit,
      color,
      description: `
        <b>codigo reserva :  ${el.id} </b>
        <hr/>
        documento: ${el.host.document}
        <br/>
        nombre: ${el.host.name} 
        <br/>
        tel: ${el.host.numberPhone} 
        <br/>
        email: ${el.host.email} 
      `,
      category: "Presentación",
    };
  });
};

document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");

  let eventModal = new bootstrap.Modal(document.getElementById("eventModal"), {
    // backdrop: "static",
    // keyboard: false,
  });

  let eventModalLabel = document.getElementById("eventModalLabel");
  let eventModalBody = document.getElementById("eventModalBody");

  const calendar = new Calendar(calendarEl, {
    initialView: "dayGridMonth",
    plugins: [bootstrap5Plugn],
    headerToolbar: {
      // left: "prev,next",
      // right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    eventMouseEnter: function(info) {
      var eventElement = info.el;
      eventElement.style.cursor = 'pointer'; // Cambia el cursor
    },
    themeSystem: "bootstrap5",
    events: (await getReservations()) || [],
    timeZone: "UTC",
    locale: "es",
    displayEventTime: false,
    eventClick: function (info) {
      eventModalLabel.textContent = info.event.title;
      eventModalBody.innerHTML = info.event.extendedProps.description;
      eventModal.show();
    },
  });

  $btnReservar.addEventListener("click", async (e = event) => {
    e.preventDefault();

    try {
      await reservar();
    } catch (error) {
      console.log(error);
      return;
    }

    calendar.removeAllEvents();
    calendar.addEventSource(await getReservations());
    console.log("recarga calendar");
  });

  calendar.render();
});
