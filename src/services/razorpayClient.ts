export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface CheckoutOptions {
  planTier: 'medium' | 'pro';
  userProfile: { uid: string; email: string; displayName?: string } | null;
  onSuccess: (newPlan: 'medium' | 'pro') => void;
  onError: (errMsg: string) => void;
  onStartLoading?: () => void;
  onEndLoading?: () => void;
}

export async function initiateRazorpayCheckout({
  planTier,
  userProfile,
  onSuccess,
  onError,
  onStartLoading,
  onEndLoading
}: CheckoutOptions) {
  if (onStartLoading) onStartLoading();

  try {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      if (onEndLoading) onEndLoading();
      onError('Failed to load Razorpay payment gateway script. Please check internet connection.');
      return;
    }

    // Request backend to create Razorpay Subscription
    const res = await fetch('/api/payment/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planTier,
        userId: userProfile?.uid,
        userEmail: userProfile?.email
      })
    });

    const data = await res.json();

    if (!res.ok || data.status !== 'success') {
      if (onEndLoading) onEndLoading();
      onError(data.error || 'Failed to initialize subscription with Razorpay.');
      return;
    }

    const { subscriptionId, keyId } = data;

    if (!subscriptionId || !keyId) {
      if (onEndLoading) onEndLoading();
      onError('Invalid response from server for Razorpay subscription initialization.');
      return;
    }

    if (onEndLoading) onEndLoading();

    const options = {
      key: keyId,
      subscription_id: subscriptionId,
      name: 'Fiza-Fiyat SaaS Hub',
      description: `Fiza-Fiyat ${planTier.toUpperCase()} Plan (Monthly Recurring)`,
      prefill: {
        name: userProfile?.displayName || '',
        email: userProfile?.email || ''
      },
      theme: {
        color: '#9333ea' // Purple theme
      },
      handler: async function (response: any) {
        if (onStartLoading) onStartLoading();
        try {
          const verifyRes = await fetch('/api/payment/verify-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              planTier,
              userId: userProfile?.uid,
              userEmail: userProfile?.email
            })
          });

          const verifyData = await verifyRes.json();
          if (onEndLoading) onEndLoading();

          if (verifyRes.ok && verifyData.status === 'success') {
            onSuccess(planTier);
          } else {
            onError(verifyData.error || 'Razorpay payment signature verification failed on server.');
          }
        } catch (err: any) {
          if (onEndLoading) onEndLoading();
          onError(err.message || 'Error verifying subscription with server.');
        }
      },
      modal: {
        ondismiss: function () {
          if (onEndLoading) onEndLoading();
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (err: any) {
    if (onEndLoading) onEndLoading();
    onError(err.message || 'An unexpected error occurred launching Razorpay checkout.');
  }
}
