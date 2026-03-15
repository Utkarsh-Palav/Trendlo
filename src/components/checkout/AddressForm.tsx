import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { CheckoutFormData } from './CheckoutForm'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

interface AddressFormProps {
  register: UseFormRegister<CheckoutFormData>
  errors: FieldErrors<CheckoutFormData>
}

export default function AddressForm({ register, errors }: AddressFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[#374151] text-sm font-medium mb-1">
          Address line
        </label>
        <input
          {...register('address')}
          placeholder="House no., street, area"
          className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
        />
        {errors.address && (
          <p className="text-[#EF4444] text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#374151] text-sm font-medium mb-1">City</label>
          <input
            {...register('city')}
            placeholder="Mumbai"
            className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
          />
          {errors.city && (
            <p className="text-[#EF4444] text-xs mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[#374151] text-sm font-medium mb-1">Pincode</label>
          <input
            {...register('pincode')}
            placeholder="400001"
            maxLength={6}
            className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
          />
          {errors.pincode && (
            <p className="text-[#EF4444] text-xs mt-1">{errors.pincode.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[#374151] text-sm font-medium mb-1">State</label>
        <select
          {...register('state')}
          className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors bg-white"
        >
          <option value="">Select state</option>
          {INDIAN_STATES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.state && (
          <p className="text-[#EF4444] text-xs mt-1">{errors.state.message}</p>
        )}
      </div>
    </div>
  )
}