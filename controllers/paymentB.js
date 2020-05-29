var braintree = require("braintree");

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'zrpjzkc2r7d5wvqt',
    publicKey:    'z9mcbw2r9zdnyrbh',
    privateKey:   '79b1fa5be6e9a94ddf61cf8b5a4cdb29'
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;

  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
        if (err) {
            res.status(500).send(error);
          } else {
            res.json(result);
          }
    }
  );
};
