import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { bookTerapias, fetchReservedTimes } from './BookingFunctions'; // Asegúrate de que esta función devuelve la estructura correcta


const availableTimes = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

const DateTimeModal = ({ open, handleClose, terapias }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(availableTimes[0]);
  const [name, setName] = useState('');
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [reservedTimes, setReservedTimes] = useState({}); // Estructura correcta: { 'YYYY-MM-DD': ['08:00', '09:00'] }

  useEffect(() => {
    const loadReservedTimes = async () => {
      try {
        const bookings = await fetchReservedTimes(); // Suponiendo que fetchReservedTimes devuelva [{ date: '2024-09-22', time: '08:00' }]
        const timesByDate = bookings.reduce((acc, booking) => {
          const { date, time } = booking;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(time);
          return acc;
        }, {});
        setReservedTimes(timesByDate); // Estructura esperada: { 'YYYY-MM-DD': ['08:00', '09:00'] }
      } catch (error) {
        console.error('Error al cargar las horas reservadas:', error);
      }
    };

    loadReservedTimes();
  }, []); // Se ejecuta solo una vez al montar el componente

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setSelectedTime(availableTimes[0]); // Resetear hora al cambiar de fecha
  };

  const handleConfirm = async () => {
    try {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      const dateTime = `${formattedDate} ${selectedTime}`;

      await bookTerapias(terapias, dateTime, name);
      setConfirmationMessage(`${name}, tu reserva ha sido realizada con éxito para el ${dateTime}`);

      // Actualiza las horas reservadas para la fecha seleccionada
      setReservedTimes({
        ...reservedTimes,
        [formattedDate]: [...(reservedTimes[formattedDate] || []), selectedTime]
      });

      setName(''); // Resetear el nombre
      setSelectedTime(availableTimes[0]); // Resetear la hora seleccionada
      handleClose(); // Cierra el modal de selección de fecha y hora
      setConfirmationModalOpen(true);
    } catch (error) {
      console.error('Error al reservar el terapia:', error);
      setConfirmationMessage(`Error al reservar el terapia: ${error.message}`);
      setConfirmationModalOpen(true);
    }
  };

  // Filtrar las horas disponibles basadas en la fecha seleccionada
  const filteredTimes = selectedDate
    ? availableTimes.filter(time => !(reservedTimes[selectedDate.format('YYYY-MM-DD')] || []).includes(time))
    : availableTimes;

  return (
    <>
      <Modal open={open} onClose={handleClose}>
      <Box className="modal">
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Typography variant="h6" component="h2">
            Selecciona Fecha
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha"
              value={selectedDate}
              onChange={handleDateChange}
              slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
            />
          </LocalizationProvider>
          <Typography variant="h6" component="h2">
            Selecciona Hora
          </Typography>
          <Select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            fullWidth
          >
            {filteredTimes.map(time => (
              <MenuItem key={time} value={time}>{time}</MenuItem>
            ))}
          </Select>
          <Button onClick={handleConfirm}>Reservar</Button>
        </Box>
      </Modal>

      {confirmationModalOpen && (
        <Modal
          open={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div style={{
            backgroundColor: 'white',
            color: 'black',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '500px',
            margin: '0 auto',
            marginTop: '20vh',
            textAlign: 'center'
          }}>
            <Typography id="modal-title" variant="h6" component="h2">
              {confirmationMessage}
            </Typography>
            <Button
              onClick={() => setConfirmationModalOpen(false)}
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
            >
              Cerrar
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DateTimeModal;
