# API BASE MASTER
Esse projeto foi feito com ajuda do curso da **formação Node.js do professor Victor Lima**

## API Rest de Usuarios com Knex.js e JWT

 **Exemplo de codigo**
 
 ```js
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
 ```
 

