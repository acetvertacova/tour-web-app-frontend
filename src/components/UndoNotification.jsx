export default function UndoNotification({ closeToast, message = "Processing..." }) {
    const handleUndo = () => {
        closeToast(true);
    };

    return (
        <div className="flex items-center w-full">
            <span>{message}</span>{" "}
            <button
                className="border border-purple-400 ml-auto px-2 rounded-md text-purple-400"
                onClick={handleUndo}
            >
                Undo
            </button>
            <button
                className="border border-red-400 ml-auto px-2 rounded-md text-red-400"
                onClick={() => closeToast(false)}
            >
                Confirm
            </button>
        </div>
    );
}