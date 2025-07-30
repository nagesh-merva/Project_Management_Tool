import { Mail, Phone, User } from "lucide-react"

const PrimaryContact = ({ primary_contact }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <User className="text-blue-600" size={20} />
                Primary Contact
            </h2>
            <div className="space-y-3">
                <div>
                    <p className="font-medium text-gray-900">{primary_contact.name}</p>
                    <p className="text-gray-600 text-sm">{primary_contact.designation}</p>
                </div>
                <div className="space-y-2">
                    <a
                        href={`mailto:${primary_contact.email}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <Mail size={16} />
                        {primary_contact.email}
                    </a>
                    <a
                        href={`tel:${primary_contact.phone}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <Phone size={16} />
                        {primary_contact.phone}
                    </a>
                </div>
            </div>
        </div>
    )
}

export default PrimaryContact