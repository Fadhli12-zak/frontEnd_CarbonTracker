export default function ErrorModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold text-red-600 mb-4">Peringatan!</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-primary-green px-4 py-2 text-white font-medium hover:opacity-90"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
