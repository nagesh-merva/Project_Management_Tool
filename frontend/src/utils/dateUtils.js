/**
 * Utility functions for date formatting
 * Handles dates from MongoDB ($date format), strings, Date objects
 */

/**
 * Format any date value to YYYY-MM-DD format
 * @param {string|object|Date} dateValue - Date value to format
 * @returns {string} Formatted date or "N/A" if invalid
 */
export const formatDate = (dateValue) => {
    if (!dateValue) return "N/A"

    try {
        // If it's an object with $date property (MongoDB format)
        if (typeof dateValue === 'object' && dateValue.$date) {
            return new Date(dateValue.$date).toISOString().split('T')[0]
        }

        // If it's a string, try to parse it
        if (typeof dateValue === 'string') {
            return dateValue.includes('T') ? dateValue.split('T')[0] : dateValue
        }

        // If it's a Date object
        if (dateValue instanceof Date) {
            return dateValue.toISOString().split('T')[0]
        }

        return dateValue
    } catch (err) {
        console.error('Error formatting date:', err, dateValue)
        return "N/A"
    }
}

/**
 * Format date with time (YYYY-MM-DD HH:MM:SS)
 * @param {string|object|Date} dateValue - Date value to format
 * @returns {string} Formatted datetime or "N/A" if invalid
 */
export const formatDateTime = (dateValue) => {
    if (!dateValue) return "N/A"

    try {
        let date

        // If it's an object with $date property (MongoDB format)
        if (typeof dateValue === 'object' && dateValue.$date) {
            date = new Date(dateValue.$date)
        }
        // If it's a string
        else if (typeof dateValue === 'string') {
            date = new Date(dateValue)
        }
        // If it's a Date object
        else if (dateValue instanceof Date) {
            date = dateValue
        }
        else {
            return dateValue
        }

        return date.toISOString().replace('T', ' ').substring(0, 19)
    } catch (err) {
        console.error('Error formatting datetime:', err, dateValue)
        return "N/A"
    }
}

/**
 * Check if date is valid
 * @param {any} dateValue - Date value to check
 * @returns {boolean} True if valid date
 */
export const isValidDate = (dateValue) => {
    if (!dateValue) return false

    try {
        let date

        if (typeof dateValue === 'object' && dateValue.$date) {
            date = new Date(dateValue.$date)
        } else if (typeof dateValue === 'string') {
            date = new Date(dateValue)
        } else if (dateValue instanceof Date) {
            date = dateValue
        } else {
            return false
        }

        return !isNaN(date.getTime())
    } catch {
        return false
    }
}
