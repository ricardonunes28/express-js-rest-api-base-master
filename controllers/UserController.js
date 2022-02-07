var User = require('../models/User');
var PasswordToken = require('../models/PasswordToken');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var secret = '122726' // chave, defiinindo secret

class UserController {

    /**
     * listar todos os usuarios 
     * @param {*} res 
     * @param {*} req 
     */
    async index(req, res) {
        let users = await User.findAll();
        res.json({ users });

    }

    /**
     * Listando um usuario por id...
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async findUser(req, res) {
        var id = req.params.id;
        var user = await User.findById(id)
        if (user == undefined) {
            res.status(404)
            res.json({})
        } else {
            res.status(200)
            res.json({ user })
        }
    }

    /**
     * metodo responsavel pegar requisição do usuario (corpo da requisição) e printar no console!
     */
    async create(req, res) {
        var { name, email, password } = req.body;

        if (name == undefined || name.length < 3) {
            res.status(400)
            res.json({ err: 'O dados preenchidos são invalido!' })
            return;
        }
        if (email == undefined || email == '') {
            res.status(400)
            res.json({ err: 'O dados preenchidos são invalido!' })
            return;
        }
        if (password == undefined) {
            res.status(400)
            res.json({ err: 'O dados preenchidos são invalido!' })
            return;
        }

        /**
         * Se email existe vou mandar um status e uma mensagem!
         */
        var emailExist = await User.findEmail(email)

        if (emailExist) {
            res.status(406)
            res.json({ err: 'O email já esta cadastrado' })
            return;
        }
        //após a validação ele vai cadastrar no banco de dados...
        await User.new(name, email, password)


        res.status(200)
        res.send('Tudo Ok')
    }

    /**
     * Função de edição percorrendo por corpo fazendo a verificação se result é diferente undefined.
     * @param {*} req 
     * @param {*} res 
     */
    async edit(req, res) {
        var { id, name, email, role } = req.body;
        var result = await User.update(id, name, email, role)

        if (result != undefined) {
            if (result.status) {
                res.status(200)
                res.send('tudo Ok')
            } else {
                res.status(406)
                res.send(result.err)
            }
        } else {
            res.status(406)
            res.send('Ocorreu um erro no servidor')
        }
    }

    /**
     * Fazendo a deleção de um usuario no meu banco de dados, buscando por ID colocando dentro de Result para ver  o resultado da deleção...
     * @param {*} req 
     * @param {*} res 
     */
    async remove(req, res) {
        var id = req.params.id;

        var result = await User.delete(id)

        if (result.status) { // status vindo la do model ou service. 
            res.status(200)
            res.send('tudo Ok')
        } else {
            res.status(406)
            res.send(result.err)
        }
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * 
     * Aqui então vamos pegar as informações fornecidas pelo usuario, no caso o email, e incluir isso para a criação se estiver tudo ok , da recuperação da senha.
     * 
     * 
     */

    async recoverPassword(req, res) {
        var email = req.body.email;
        var result = await PasswordToken.create(email)
        if (result.status) {
            res.status(200)
            res.send(result.token.toString()) // como token é numerico aqui estamos usando toString()para modificar para string e conseguimos vizualizar o token, no res.send
        } else {
            res.status(406)
            res.send(result.err)
        }
    }

    async changePassword(req, res) {
        var token = req.body.token;
        var password = req.body.password;
        var isTokenValid = await PasswordToken.validate(token)

        if (isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200)
            res.send('Senha Alterada')

        } else {
            res.status(406)
            res.send('Token invalido')
        }
    }


    async login(req, res) {
        var { email, password } = req.body;

        var user = await User.findByEmail(email)
        if (user != undefined) {
            var resultado = await bcrypt.compare(password, user.password) // comparando a senha que ele digitar com a senha criptada
            // res.json({ status: resultado }) // resultado da comparação se é verdadeiro ou falsa!

            if(resultado){
                var token = jwt.sign({ email: user.email, role: user.role }, secret); // criando o otken jwt passando o email do usuario logado e o cargo do usuario locado
                res.status(200)
                res.json({token:token})
        
            }else{
                res.status(406)
                res.send('Senha errada')
            }

        } else {
            res.json({ status: false })
        }
    }
}


module.exports = new UserController(); // exportando um novo objeto do controller para usar em outro arquivo
