export const GET = async (request: Request) => {
    console.log('paymongo!');
    const createCheckoutSession = await fetch(
        'https://api.paymongo.com/v1/checkout_sessions',
        {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: `Basic ${Buffer.from('sk_test_xCp1Ud4p9LsomNjQaAEV2TQ6').toString('base64')}`,
            },
            body: JSON.stringify({
                data: {
                    attributes: {
                        billing: {
                            email: 'testEmail@email.com',
                            name: 'test',
                            phone: 'testnumber',
                        },
                        send_email_receipt: false,
                        show_description: true,
                        show_line_items: true,
                        description: 'test',
                        line_items: [
                            {
                                // Notice this is now an array
                                currency: 'PHP',
                                amount: 20 * 100,
                                description: 'No description provided',
                                name: 'test',
                                quantity: 1,
                            },
                        ],
                        payment_method_types: ['gcash'],
                        cancel_url: 'http://localhost:3000/cancel', // Add proper URLs
                        success_url: 'http://localhost:3000/success',
                    },
                },
            }),
        }
    );

    try {
        const checkoutResponse = await createCheckoutSession.json();
        console.log('Checkout Session Response: ', checkoutResponse);

        if (!createCheckoutSession.ok) {
            throw new Error(JSON.stringify(checkoutResponse));
        }

        const checkoutURL = checkoutResponse.data.attributes.checkout_url;
        console.log('Checkout URL: ', checkoutURL);

        return Response.json({ checkoutURL });
    } catch (error) {
        console.error('Error:', error);
        return Response.json({
            error: 'Failed to create a checkout session',
        });
    }
};
