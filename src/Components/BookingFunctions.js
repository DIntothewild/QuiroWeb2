// BookingFunctions.js
import axios from "axios";

// No se toca, salvo que quieras almacenar más campos
export function createTerapias(
  name,
  type,
  description,
  backgroundImage = null,
  precios = null
) {
  return {
    name,
    type,
    description,
    backgroundImage,
    precios,
    isBooked: false,
  };
}

export async function bookTerapias(terapia, dateTime, name, param4, param5) {
  try {
    // 1. Validar
    if (!terapia || !terapia.name) {
      throw new Error(
        "El objeto 'terapia' no está definido o falta el nombre."
      );
    }
    if (!dateTime) {
      throw new Error("No se ha proporcionado dateTime.");
    }

    // 2. dateTime => "2025-03-05 10:00"
    const [date, time] = dateTime.split(" ");
    // 3. Preparamos campos básicos
    const requestBody = {
      customerName: name,
      terapiasType: terapia.name, // Se guarda en la BD como 'terapiasType'
      date, // "YYYY-MM-DD"
      time, // "HH:MM"
      status: "booked",
    };

    // 4. Decidimos cómo asignar param4 y param5
    //    - Si es Quiromasaje => param4 = tipoMasaje, param5 = comentario
    //    - Si es Osteopatía => param4 = zonaTratar, param5 = osteoComentario
    //    - Si es Entrenamiento => param4 = objeto con perderPeso..., param5 = undefined
    // Este switch es opcional, pero ayuda a clarificar
    switch (terapia.name) {
      case "Quiromasaje":
        requestBody.tipoMasaje = param4 || "";
        requestBody.comentario = param5 || "";
        break;
      case "Osteopatía":
        requestBody.tipoMasaje = param4 || ""; // 'zonaTratar' en realidad
        requestBody.comentario = param5 || ""; // 'osteoComentario'
        break;
      case "Entrenamiento personal":
        // param4 es un objeto { perderPeso, ... }
        requestBody.tipoMasaje = JSON.stringify(param4); // Se guarda en BD
        requestBody.comentario = ""; // No hay param5
        break;
      default:
        // Otras terapias
        requestBody.tipoMasaje = param4 || "";
        requestBody.comentario = param5 || "";
        break;
    }

    console.log("Datos enviados a backend:", requestBody);

    // 5. Petición POST al backend
    const response = await axios.post(
      "http://localhost:3000/bookings",
      requestBody
    );

    console.log("Reserva realizada con éxito:", response.data);
  } catch (error) {
    console.error("Error al reservar el terapia:", error);
  }
}

// Cancelar reserva
export async function cancelBookedTerapias(terapia) {
  if (terapia.isBooked && terapia._id) {
    try {
      await axios.delete(`http://localhost:3000/bookings/${terapia._id}`);
      terapia.isBooked = false;
      console.log(`El terapia ${terapia.name} ha sido cancelado con éxito`);
    } catch (error) {
      console.error(`Error al cancelar el terapia ${terapia.name}:`, error);
    }
  } else {
    console.log(
      `El terapia ${terapia.name} no está reservado o no tiene un ID válido`
    );
  }
}

// Filtrado (opcional)
export function availabilityTerapias(terapiass, type) {
  return terapiass.find((t) => !t.isBooked && t.type === type) || null;
}

// Filtrado de horas reservadas por fecha y tipo
export async function fetchReservedTimes(date, therapyName) {
  try {
    // ?date=YYYY-MM-DD&terapiasType=Quiromasaje
    const url = `http://localhost:3000/bookings?date=${date}&terapiasType=${encodeURIComponent(
      therapyName
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error al obtener las horas reservadas");
    }
    const data = await response.json();
    return data.map((booking) => booking.time);
  } catch (error) {
    console.error("Error al obtener las horas reservadas:", error);
    return [];
  }
}
