import { useState } from "react";
import {
  getPaymentsByMonth,
  formatCurrency,
  createPayment,
  updatePayment,
  deletePayment,
} from "../lib/payments.ts";
import { obtenerPropiedadAlquilerPorId } from "../lib/propiedadesFirestore.ts";

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
  const currentYear = new Date().getFullYear();

  const cargarDatos = async () => {
    try {
      const propiedadData = await obtenerPropiedadAlquilerPorId(propertyId);
      if (!propiedadData) throw new Error("No se encontró la propiedad");
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
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const abrirModal = (monthIndex, payment = null) => {
    setModalData({
      month: monthIndex,
      payment,
      defaultAmount: propiedad?.precioAlquiler || "",
    });
  };

  const cerrarModal = () => setModalData(null);

  const handleGuardarPago = async (data) => {
    try {
      if (data.paymentId) {
        await updatePayment(data.paymentId, data);
      } else {
        await createPayment(data);
      }
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar pago:", error);
    }
  };

  const handleEliminarPago = async (paymentId) => {
    if (!window.confirm("¿Eliminar este pago?")) return;
    await deletePayment(paymentId);
    cargarDatos();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {propiedad ? `Pagos de ${propiedad.propietario}` : "Cargando..."}
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
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{monthNames[month]}</h3>
                <button
                  onClick={() => abrirModal(month)}
                  className="text-primary hover:text-rosaOscuro"
                >
                  ➕
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Total pagado:{" "}
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
                        onClick={() => handleEliminarPago(pago.id)}
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
          onSave={handleGuardarPago}
        />
      )}
    </div>
  );
};

export default PagosPropiedad;
