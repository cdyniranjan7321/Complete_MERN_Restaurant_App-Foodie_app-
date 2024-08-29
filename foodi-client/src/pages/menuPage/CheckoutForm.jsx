import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { FaPaypal} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CheckoutForm = ({ price, cart}) => {
  const stripe = useStripe();
  const elements = useElements();
  const {user} = useAuth();
  const axiosSecure = useAxiosSecure();

  const [cardError, setCardError] = useState('')
  const [clientSecret, setClientSecret] = useState("");


  useEffect(() => {
    axiosSecure.post('/create-payment-intent', {price})
    .then( res => {
      console.log(res.data)//1:17:04 sec
    })

  }, [price, axiosSecure])

  const handleSubmit = async (event) => {
     // Block native form submission.
     event.preventDefault();
     if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    // create card element
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }
       // Use your card Element with other Stripe.js APIs
       const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });
  
      if (error) {
        console.log('[error]', error);
        setCardError(error.message)
      } else {
        setCardError("success!")
        console.log('[PaymentMethod]', paymentMethod);
      }
    const {paymentIntent, error:confirmError}= await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || 'anonymous',
            email: user?.email || 'unknow'
          },
        },
      },
    ) ;

  };
  return (
    <div className='flex flex-col sm:flex-row justify-start items-start gap-8'>
    {/* left side */}
    <div className='md:w-1/2 w-full space-y-3'>
    <h4 className='text-lg font-semibold'>Order Summary</h4>
    <p>Total Price: ${price}</p>
    <p>Number of Items: {cart.length}</p>
    </div>
    {/* Right side */}
    <div className='md:w-1/3 w-full space-y-5 card shrink-0 max-w-sm shadow-2xl bg-base-100 px-4 py-8'>
    <h4 className='text-lg font-semibold'>Process your Payment!</h4>
    <h5 className='font-medium'>Credit/Debit Card</h5>

    {/* stripe form */}
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button 
      type="submit" 
      disabled={!stripe} 
      className="btn btn-sm mt-5 btn-primary w-full text-white"
      >
        Pay
      </button>
    </form>
    {
        cardError ? <p className="text-red italic text-xs">{cardError}</p>:""
    }


{/* paypal  */}
<div className="mt-5 text-center">
  <hr/>
  <button 
      type="submit" 
      className='btn btn-sm mt-5 bg-orange-500 text-white'
      >
        <FaPaypal/> Pay with Paypal
      </button>
       </div>

    </div>
</div>
  )
}

export default CheckoutForm
