import { useState, useEffect } from "react";
import { formatCurrency } from "../lib/payments.ts";

const ModalRegistrarPago = ({ data, onClose, onSave }) => {
  const { month, payment, defaultAmount } = data;
  const [formData, setFormData] = useState({
    amount: payment ? payment.amount : defaultAmount || 0,
    date: payment
      ? new Date(payment.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    notes: payment?.notes || "",
    paymentId: payment?.id || null,
  });

  useEffect(() => {
    // Focus on the amount input when modal opens
    const timer = setTimeout(() => {
      document.getElementById("modal-amount")?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    onSave({
      ...formData,
      propertyId: data.propertyId,
      month,
      monthName: monthNames[month],
      year: new Date().getFullYear(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {payment ? "Editar Pago" : "Registrar Nuevo Pago"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="modal-amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Monto
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                id="modal-amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                required
                step="0.01"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="modal-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha de Pago
            </label>
            <input
              id="modal-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="modal-notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notas (opcional)
            </label>
            <textarea
              id="modal-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              placeholder="Detalles adicionales del pago..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-rosaOscuro"
            >
              {payment ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegistrarPago;
