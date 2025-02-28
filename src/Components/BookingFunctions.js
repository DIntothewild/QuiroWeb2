import axios from "axios";

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

export async function bookTerapias(
  terapias,
  date,
  name,
  tipoMasaje,
  comentario
) {
  try {
    if (!terapias || !terapias.name) {
      throw new Error(
        "El objeto del terapia no está definido o falta el nombre."
      );
    }

    const requestBody = {
      customerName: name,
      terapiasType: terapias.name, // O therapyId si tu backend lo usa
      date: date.split(" ")[0],
      time: date.split(" ")[1],
      status: "booked",
      tipoMasaje, // Nuevo campo
      comentario, // Nuevo campo
    };

    console.log("Datos enviados:", requestBody);

    const response = await axios.post(
      "http://localhost:3000/bookings",
      requestBody
    );

    console.log("Reserva realizada con éxito:", response.data);
  } catch (error) {
    console.error("Error al reservar el terapia:", error);
  }
}

export async function cancelBookedTerapias(terapias) {
  if (terapias.isBooked && terapias._id) {
    try {
      await axios.delete(`http://localhost:3000/bookings/${terapias._id}`);
      terapias.isBooked = false;
      console.log(`El terapia ${terapias.name} ha sido cancelado con éxito`);
    } catch (error) {
      console.error(`Error al cancelar el terapia ${terapias.name}:`, error);
    }
  } else {
    console.log(
      `El terapia ${terapias.name} no está reservado o no tiene un ID válido`
    );
  }
}

export function availabilityTerapias(terapiass, type) {
  return (
    terapiass.find(
      (terapias) => !terapias.isBooked && terapias.type === type
    ) || null
  );
}

export async function fetchReservedTimes(date) {
  try {
    const response = await fetch(`http://localhost:3000/bookings?date=${date}`);
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
