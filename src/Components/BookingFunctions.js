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
    description, // Usa la descripción proporcionada
    backgroundImage,
    precios,
    isBooked: false, // Estado inicial para indicar que el terapia no está reservado
  };
}

export async function bookTerapias(terapias, date, name) {
  try {
    if (!terapias || !terapias.name) {
      throw new Error(
        "El objeto del terapia no está definido o falta el nombre."
      );
    }

    const requestBody = {
      customerName: name,
      terapiasType: terapias.name, // Cambiado a terapias.name para que sea un string
      date: date.split(" ")[0], // Asegúrate de que la fecha esté en el formato correcto
      time: date.split(" ")[1], // Asegúrate de que la hora esté en el formato correcto
      status: "booked",
    };

    console.log("Datos enviados:", requestBody);

    const response = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Error al reservar el terapia");
    }

    const data = await response.json();
    console.log("Reserva realizada con éxito:", data);
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
    return data.map((booking) => booking.time); // Devuelve solo las horas reservadas
  } catch (error) {
    console.error("Error al obtener las horas reservadas:", error);
    return [];
  }
}
