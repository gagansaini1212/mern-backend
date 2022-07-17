const stripe = require('stripe')(process.env.STRIPE_KEY);
const uuidv1 = require('uuid/v1');

exports.makePayment = (req, res) => {
  const { products, token } = req.body;
  console.log('products', products);

  let amount = 0;
  products.map((product) => {
    amount = amount + product.price;
  });

  const idempotencyKey = uuidv1;
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: 'A test account',
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
              },
            },
          },
          { idempotencyKey },
        )
        .then((result) => result.status(200).json(result))
        .catch((err) => console.log(err));
    });
};
