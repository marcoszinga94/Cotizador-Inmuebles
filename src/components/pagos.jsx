import { useState, useEffect } from "react";
import {
  getPaymentsByMonth,
  formatCurrency,
  createPayment,
  updatePayment,
  deletePayment,
} from "../lib/payments.ts";
import { obtenerPropiedadAlquilerPorId } from "../lib/propiedadesFirestore.ts";
import ModalRegistrarPago from "./ModalRegistrarPago.jsx";

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const PagosPropiedad = ({ propertyId }) => {
  const [propiedad, setPropiedad] = useState(null);
  const [pagosPorMes, setPagosPorMes] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    console.log("Property ID received:", propertyId);
    cargarDatos();
  }, [propertyId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const propiedadData = await obtenerPropiedadAlquilerPorId(propertyId);
      if (propiedadData) {
        setPropiedad(propiedadData);

        const pagosMes = await Promise.all(
          Array.from({ length: 12 }).map(async (_, month) => {
            const pagos = await getPaymentsByMonth(
              propertyId,
              currentYear,
              month
            );
            return {
              month,
              pagos,
              total: pagos.reduce((sum, pago) => sum + pago.amount, 0),
            };
          })
        );
        setPagosPorMes(pagosMes);
      } else {
        setError(`Propiedad con ID ${propertyId} no encontrada`);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos de la propiedad");
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (monthIndex, payment = null) => {
    setModalData({
      month: monthIndex,
      payment,
      defaultAmount: propiedad?.precioAlquiler || "",
      propertyId: propiedad.propertyId,
    });
  };

  const cerrarModal = () => setModalData(null);

  const guardarPago = async (data) => {
    try {
      setLoading(true);

      // Validar datos antes de guardar
      if (!data.amount || data.amount <= 0) {
        throw new Error("El monto del pago debe ser mayor a cero");
      }

      if (!data.date) {
        throw new Error("Debe seleccionar una fecha válida");
      }

      if (data.paymentId) {
        await updatePayment(data.paymentId, data);
      } else {
        await createPayment(data);
      }

      // Actualizar el estado local primero
      setPagosPorMes((prev) => {
        const newPagos = [...prev];
        const monthIndex = data.month;
        const updatedPagos = data.paymentId
          ? newPagos[monthIndex].pagos.map((p) =>
              p.id === data.paymentId ? { ...p, ...data } : p
            )
          : [...newPagos[monthIndex].pagos, data];

        newPagos[monthIndex] = {
          ...newPagos[monthIndex],
          pagos: updatedPagos,
          total: updatedPagos.reduce((sum, p) => sum + p.amount, 0),
        };
        return newPagos;
      });

      cerrarModal();
      // Recargar datos para sincronizar con la base de datos
      await cargarDatos();

      // Feedback visual
      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg";
      toast.textContent = "Pago guardado exitosamente";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      console.error("Error al guardar pago:", error);
      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg";
      toast.textContent = error.message || "Error al guardar el pago";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPago = async (paymentId) => {
    if (!window.confirm("¿Eliminar este pago?")) return;
    try {
      await deletePayment(paymentId);
      setPagosPorMes((prev) => {
        const newPagos = [...prev];
        const monthIndex = newPagos.findIndex((month) =>
          month.pagos.some((p) => p.id === paymentId)
        );
        if (monthIndex !== -1) {
          newPagos[monthIndex] = {
            ...newPagos[monthIndex],
            pagos: newPagos[monthIndex].pagos.filter((p) => p.id !== paymentId),
            total: newPagos[monthIndex].pagos
              .filter((p) => p.id !== paymentId)
              .reduce((sum, p) => sum + p.amount, 0),
          };
        }
        return newPagos;
      });

      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg";
      toast.textContent = "Pago eliminado correctamente";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      console.error("Error al eliminar pago:", error);
      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg";
      toast.textContent = "Error al eliminar el pago";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando datos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {propiedad
              ? `Pagos de ${propiedad.propietario}`
              : "Propiedad no encontrada"}
          </h1>
          <p className="text-gray-600 mt-1">
            Monto del alquiler:{" "}
            <span className="font-medium text-green-600">
              {propiedad ? formatCurrency(propiedad.precioAlquiler) : "$0"}
            </span>
          </p>
        </div>
        <a href="/propiedades" className="text-primary hover:text-rosaOscuro">
          Volver
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">{currentYear}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagosPorMes.map(({ month, pagos, total }) => (
            <div
              key={month}
              className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{monthNames[month]}</h3>
                <button
                  onClick={() => abrirModal(month)}
                  className="text-primary hover:text-rosaOscuro text-3xl"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Total pagado:{""}
                <span className="font-medium text-green-600">
                  {formatCurrency(total)}
                </span>
              </p>
              <div className="space-y-2">
                {pagos.map((pago) => (
                  <div
                    key={pago.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <div className="font-medium">
                        {formatCurrency(pago.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(pago.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal(month, pago)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        🖊
                      </button>
                      <button
                        onClick={() => eliminarPago(pago.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalData && (
        <ModalRegistrarPago
          data={modalData}
          onClose={cerrarModal}
          onSave={guardarPago}
        />
      )}
    </div>
  );
};

export default PagosPropiedad;
