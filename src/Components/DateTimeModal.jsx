import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { bookTerapias, fetchReservedTimes } from './BookingFunctions';

const availableTimes = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

const DateTimeModal = ({ open, handleClose, terapias }) => {
  // ESTADOS EXISTENTES
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(availableTimes[0]);
  const [name, setName] = useState('');
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [reservedTimes, setReservedTimes] = useState({});

  // NUEVOS ESTADOS
  const [tipoMasaje, setTipoMasaje] = useState('relajante');
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    const loadReservedTimes = async () => {
      try {
        // Suponiendo que fetchReservedTimes devuelve [{ date: '2024-09-22', time: '08:00' }]
        const bookings = await fetchReservedTimes();
        const timesByDate = bookings.reduce((acc, booking) => {
          const { date, time } = booking;
          if (!acc[date]) acc[date] = [];
          acc[date].push(time);
          return acc;
        }, {});
        setReservedTimes(timesByDate);
      } catch (error) {
        console.error('Error al cargar las horas reservadas:', error);
      }
    };
    loadReservedTimes();
  }, []);

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setSelectedTime(availableTimes[0]);
  };

  const handleConfirm = async () => {
    try {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      const dateTime = `${formattedDate} ${selectedTime}`;

      await bookTerapias(terapias, dateTime, name, tipoMasaje, comentario);
      setConfirmationMessage(`${name}, tu reserva ha sido realizada con éxito para el ${dateTime}`);

      // Actualiza las horas reservadas para la fecha seleccionada
      setReservedTimes({
        ...reservedTimes,
        [formattedDate]: [...(reservedTimes[formattedDate] || []), selectedTime]
      });

      // Resetea campos
      setName('');
      setSelectedTime(availableTimes[0]);
      setTipoMasaje('relajante');
      setComentario('');

      handleClose();
      setConfirmationModalOpen(true);
    } catch (error) {
      console.error('Error al reservar el terapia:', error);
      setConfirmationMessage(`Error al reservar el terapia: ${error.message}`);
      setConfirmationModalOpen(true);
    }
  };

  const filteredTimes = selectedDate
    ? availableTimes.filter(
        time => !(reservedTimes[selectedDate.format('YYYY-MM-DD')] || []).includes(time)
      )
    : availableTimes;

  return (
    <>
      {/* MODAL PRINCIPAL */}
      <Modal
        open={open}
        onClose={handleClose}
        // Estilos con sx para evitar conflictos con clases
        sx={{
          display: 'flex',
          alignItems: 'flex-start', // Aparece cerca de la parte superior
          justifyContent: 'center',
          marginTop: '10%',         // Separa del header
          zIndex: 99999
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            width: '80%'
          }}
        >
          {/* Nombre */}
          {/* <TextField
            label="Nombre"
            InputLabelProps={{ shrink: true }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          /> */}
          <Typography variant="h6">Nombre</Typography>
<TextField
  placeholder="Ingresa tu nombre"
  value={name}
  onChange={(e) => setName(e.target.value)}
  fullWidth
/>

          {/* Tipo de masaje */}
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            Tipo de masaje
          </Typography>
          <Select
            value={tipoMasaje}
            onChange={(e) => setTipoMasaje(e.target.value)}
            fullWidth
          >
            <MenuItem value="relajante">Relajante</MenuItem>
            <MenuItem value="lesiones">Lesiones</MenuItem>
            <MenuItem value="espalda">Espalda</MenuItem>
            <MenuItem value="piernas">Piernas</MenuItem>
            <MenuItem value="otra">Otra parte del cuerpo</MenuItem>
          </Select>

          {/* Comentarios */}
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            Comentarios
          </Typography>
          <TextField
            label="Coméntanos aspectos importantes..."
            multiline
            rows={3}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            fullWidth
          />

          {/* Fecha */}
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
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

          {/* Hora */}
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
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

          {/* Botón Reservar */}
          <Button
            sx={{ mt: 2 }}
            onClick={handleConfirm}
            variant="contained"
          >
            Reservar
          </Button>
        </Box>
      </Modal>

      {/* MODAL DE CONFIRMACIÓN */}
      {confirmationModalOpen && (
        <Modal
          open={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: '10%',
            zIndex: 99999
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              maxWidth: '400px',
              width: '80%'
            }}
          >
            <Typography variant="h6" component="h2">
              {confirmationMessage}
            </Typography>
            <Button
              onClick={() => setConfirmationModalOpen(false)}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default DateTimeModal;