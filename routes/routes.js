var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require('../controllers/UserController');
var AdminAuth = require('../middleware/AdminAuth')

router.get('/', HomeController.index);
router.post('/user', UserController.create); // UserController.create = significa que quando ele acessar a minha rota user, ele vai acessar o meu metodo create.
router.get('/user', AdminAuth, UserController.index) // quando bater nessa rota vai chamar o metodo index para listar todos os usuarios.
router.get('/user/:id',AdminAuth, UserController.findUser)// acessando a rota vai puxar  o metodo findUser
router.put('/user',AdminAuth, UserController.edit) // Put apontando para edição do controller.. 
router.delete('/user/:id',AdminAuth, UserController.remove) // delete aonde vai remover ou deleção... 

router.post('/recoverpassword',UserController.recoverPassword); //  recuperar senha
router.post('/changepassword', UserController.changePassword); // alterando senha

router.post('/login', UserController.login) // login e comparação

module.exports = router;