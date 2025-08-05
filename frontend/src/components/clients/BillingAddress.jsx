import { MapPin } from "lucide-react"

const BillingAddress = ({ location }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <MapPin className="text-green-600" size={20} />
                Billing Address
            </h2>
            <p className="text-gray-700">{location}</p>
        </div>
    )
}

export default BillingAddress