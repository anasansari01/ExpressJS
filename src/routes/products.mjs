import { Router } from "express"

const router = Router();

router.get('/api/products', (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies);
  console.log(req.signedCookies.hello);


  if (req.signedCookies.hello && req.signedCookies.hello === "world")
    return res.status(201).send([{ id: 143, name: "LOVE", price: "♾️" }])

  return res.status(404).send({ msg: `Sorry. you need the correct cookie.` })
})

export default router;