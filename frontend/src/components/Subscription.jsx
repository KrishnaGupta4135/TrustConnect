import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Card Component
const PricingCard = ({ plan, isActive, onSubscribe }) => (
  <div 
    className={`w-full sm:w-72 bg-white rounded-xl shadow-lg transition-all duration-500 transform
      ${isActive ? 'scale-100 z-20' : 'hidden sm:block sm:scale-75 sm:opacity-50'}`}
  >
    <div className={`${plan.gradient} p-4 sm:p-6 rounded-t-xl`}>
      <h3 className="text-white text-lg sm:text-xl font-bold">{plan.name}</h3>
      <p className="text-white/80 text-xs sm:text-sm mt-1">Secure Transfer Solution</p>
    </div>

    <div className="p-4 sm:p-6">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-end justify-center">
          <span className="text-2xl sm:text-3xl font-bold">$</span>
          <span className="text-4xl sm:text-5xl font-bold mx-1">{plan.price}</span>
          <span className="text-gray-500">/mo</span>
        </div>
      </div>

      <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm sm:text-base text-gray-600">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(plan)}
        className={`w-full py-2 sm:py-3 rounded-lg text-white font-medium transition-all duration-200
          ${plan.gradient} hover:opacity-90 transform hover:scale-105`}
      >
        Select Plan
      </button>
    </div>
  </div>
);

// [PropTypes remain the same]
PricingCard.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    gradient: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onSubscribe: PropTypes.func.isRequired
};

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto px-4 sm:px-0" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div className="relative inline-block w-full sm:max-w-lg rounded-lg bg-white text-left shadow-xl transform transition-all">
          <div className="absolute right-0 top-0 p-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// // [Modal PropTypes remain the same]
// Modal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   children: PropTypes.node.isRequired
// };

// // Payment Form Component
// const PaymentForm = ({ plan, onSubmit, onCancel }) => {
//   // [State and handlers remain the same]
//   const [formData, setFormData] = useState({
//     cardNumber: '',
//     expiry: '',
//     cvv: '',
//     name: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let formattedValue = value;

//     switch (name) {
//       case 'cardNumber':
//         formattedValue = value.replace(/\s/g, '')
//           .replace(/(\d{4})/g, '$1 ')
//           .trim()
//           .slice(0, 19);
//         break;
//       case 'expiry':
//         formattedValue = value
//           .replace(/\D/g, '')
//           .replace(/(\d{2})(\d)/, '$1/$2')
//           .slice(0, 5);
//         break;
//       case 'cvv':
//         formattedValue = value.replace(/\D/g, '').slice(0, 3);
//         break;
//       default:
//         break;
//     }

//     setFormData(prev => ({ ...prev, [name]: formattedValue }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 sm:p-6">
//       <h3 className="text-lg font-semibold mb-4">Complete Your Subscription</h3>
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
//           <input
//             type="text"
//             name="cardNumber"
//             value={formData.cardNumber}
//             onChange={handleChange}
//             placeholder="1234 5678 9012 3456"
//             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
//             <input
//               type="text"
//               name="expiry"
//               value={formData.expiry}
//               onChange={handleChange}
//               placeholder="MM/YY"
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
//             <input
//               type="text"
//               name="cvv"
//               value={formData.cvv}
//               onChange={handleChange}
//               placeholder="123"
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="John Doe"
//             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>

//         <div className="flex justify-end space-x-3 mt-6">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className={`px-4 py-2 rounded-lg text-white ${plan.gradient} hover:opacity-90`}
//           >
//             Pay ${plan.price}/month
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// // [PaymentForm PropTypes remain the same]
// PaymentForm.propTypes = {
//   plan: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.string.isRequired,
//     gradient: PropTypes.string.isRequired,
//     features: PropTypes.arrayOf(PropTypes.string).isRequired
//   }).isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   onCancel: PropTypes.func.isRequired
// };

// Main Component
const Subscription = () => {
  // [State and plans data remain the same]
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: "20",
      gradient: "bg-gradient-to-r from-pink-500 to-orange-500",
      features: [
        "5GB Secure Storage",
        "End-to-end Encryption",
        "2 Team Members",
        "Basic Support"
      ]
    },
    {
      id: 2,
      name: "Standard",
      price: "35",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
      features: [
        "25GB Secure Storage",
        "Advanced Encryption",
        "10 Team Members",
        "Priority Support"
      ]
    },
    {
      id: 3,
      name: "Premium",
      price: "50",
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
      features: [
        "Unlimited Storage",
        "Enterprise Security",
        "Unlimited Team Members",
        "24/7 Dedicated Support"
      ]
    }
  ];

  // [Handlers remain the same]
  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = (formData) => {
    console.log('Processing payment:', { plan: selectedPlan, formData });
    setIsModalOpen(false);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % plans.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  return (
    <div className="bg-gradient-to-r from-[#E7F5FD] to-[#FCEBE0]">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-600">Select the perfect plan for your needs</p>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          <PricingCard
            plan={plans[currentIndex]}
            isActive={true}
            onSubscribe={handleSubscribe}
          />
          <div className="flex justify-center space-x-2 mt-4">
            {plans.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block relative">
          <div className="flex justify-center items-center min-h-[500px]">
            <button
              onClick={prevCard}
              className="absolute left-4 z-30 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50"
            >
              ←
            </button>
            
            <div className="flex justify-center items-center">
              {plans.map((plan, index) => {
                const position = (index - currentIndex + plans.length) % plans.length;
                const isActive = position === 0;
                
                return (
                  <div
                    key={plan.id}
                    className={`absolute transition-all duration-500 ${
                      position === 0 ? 'translate-x-0' :
                      position === 1 ? 'translate-x-64' :
                      '-translate-x-64'
                    }`}
                  >
                    <PricingCard
                      plan={plan}
                      isActive={isActive}
                      onSubscribe={handleSubscribe}
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={nextCard}
              className="absolute right-4 z-30 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50"
            >
              →
            </button>
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            {plans.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {selectedPlan && (
          <PaymentForm
            plan={selectedPlan}
            onSubmit={handlePaymentSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Subscription;
