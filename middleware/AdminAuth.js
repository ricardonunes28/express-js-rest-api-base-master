var jwt = require('jsonwebtoken')
var secret = '122726' // chave, defiinindo secret


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * 
 * Puxando um cabeçalho da requisição que é uma autoziação , vejo se cabeçalho existe e divido ele em dois
 * Divino a string de bearer e o token
 * 
 * 
 * 
 * 
 */
module.exports = function (req, res, next) {

    const authToken = req.headers['authorization']

    if (authToken != undefined) {

        const bearer = authToken.split(' ')
        var token = bearer[1]

        try {
            var decoded = jwt.verify(token, secret)
            if(decoded.role == 1){
                next()
            }else{
                res.status(403)
                res.send("Você não tem permisão para isso")
                return
            }
        } catch (error) {
            res.status(403)
            res.send("Você não esta autenticado")
            return
        }
    } else {
        console.log('Não autenticado')
    }



} // ver se tem um usuario logado, ver se ele é um admin sendo o usuario pode seguir na rota dele, e se não for ele não passa