import { CheckCircle, AlertCircle, X } from 'lucide-react'

const NotificationToast = ({ notifications, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`p-4 rounded-lg shadow-lg transition-all duration-300 transform ${notification.type === 'success'
                        ? 'bg-green-500 text-white'
                        : notification.type === 'error'
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            {notification.type === 'success' ? (
                                <CheckCircle size={20} />
                            ) : notification.type === 'error' ? (
                                <AlertCircle size={20} />
                            ) : (
                                <AlertCircle size={20} />
                            )}
                            <span className="text-sm font-medium">{notification.message}</span>
                        </div>
                        <button
                            onClick={() => onRemove(notification.id)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={16} className='cursor-pointer ' />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NotificationToast