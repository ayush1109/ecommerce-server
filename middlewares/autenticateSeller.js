const jwt =require('jsonwebtoken')
var id;
exports.verifySeller = function (req,res,next) {
  try{
    const token=req.header('Authorization').replace('Bearer ','')
    jwt.verify(token,process.env.JWT, function (err, decoded) {
      if(!err) {
          id = decoded;
          console.log(id)
        next();
      }
      else {
        res.status(400).send({error:'Please authenciate'})
      }
    })
  }
  catch(e) {
    res.status(400).send({error:'Please authenciate'})
  }
}

exports.sendCredientals = function () {
    return id;
};

    


