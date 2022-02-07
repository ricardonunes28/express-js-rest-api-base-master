var knex = require('../database/connection');
var bcrypt = require('bcrypt');
const PasswordToken = require('./PasswordToken');


/**
 * Model ou service lidando com dados
 */
class User {

    async findAll() { // Aqui selecionamos todos os usuarios da tabela users se estiver tudo ok, vai retorna o resultado se der algum erro, informa o erro e um array vazio.
        try {
            var result = await knex.select(["id", "name", "email", "role"]).table('users')
            return result;
        }
        catch (error) {
            console.log(error)
            return [];
        }

    }

    /**
     * Metodo para buscar id de usuario
     * @param {*} id id do usuario cadastrado
     * @returns 
     */

    async findById(id) {
        try {
            var result = await knex.select(["id", "name","email", "role"]).where({ id: id }).table('users')
            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }
        }
        catch (error) {
            console.log(error)
            return undefined;
        }
    }

    async findByEmail(email) {
        try {
            var result = await knex.select(["id", "name","password", "email", "role"]).where({email: email }).table('users')
            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }
        }
        catch (error) {
            console.log(error)
            return undefined;
        }
    }
    
    async new(name, email, password) { // por padrão todo novo usuario será um usuario comun , pasando por parão 0
        try {
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({ name, email, password: hash, role: 0 }).table("users");
        } catch (err) {
            console.log(err)
        }

    }

    /**
     * Metodo para analisar email, para dizer se email já existe ou não no banco de dados
     * @param {*} email 
     */
    async findEmail(email) {

        try {
            // Vericando no meu banco de dados na tabela uses se email, informado no cadastro, já existe!
            var result = await knex.select('*').from('users').where({ email: email })
            // Procurando se o email for igual ao cadastrado. returnando verdadeiro ou falso.
            // result.length = porque retorna um array de informações e se o array for maior que  siginifica que tem alguma coisa dentro do array. Um usuario que esta cadastrado (achando email)

            if (result.length > 0) {
                return true
            } else {
                return false
            }
        } catch (err) {
            console.log(err)
        }


    }

    /**
     * Edição dos campos Name, email e role.
     */

    async update(id, name, email, role) {

        var user = await this.findById(id) // ver se o usuario existe ou não com o ID

        if (user != undefined) {
            var editUser = {}; // Vamos preencher dependendo das informações que o usuario vai passar.
            if(name != undefined){
                editUser.name = name;
            }
            if (email != undefined) {
                if (email != user.email) { // verificando se o email é diferente do cadastrado. Siginifica o emailvai ser alterado. 
                    var result = await this.findEmail(email) // não será possivel cadastrar o mesmo email novamente, se for o mesmo ele vai retorna como true, já existente e vai informa que email já esta cadastrado.
                    if (result == false) {
                        editUser.email = email // criando o campo de email 
                    }else{
                        return { status: false, err: 'O email já esta cadastrado!'}
                    }
                }
            }
            if(role != undefined){
                editUser.role = role;
            }

            try { // editando no meu banco de dados de acordo com as informações que estão sendo passadaas em editUser, onde buscando pelo ID já existente na tabela de users.
                await knex.update(editUser).where({id: id}).table('users')
                return {status: true}
            } catch (error) {
                return { status: false, error: error}
            }
            
        } else {
            return { status: false, err: 'O usuario não existe!'} // se eu ver que o usuario não existe pelo id que ele passou eu retorno para o controller esse objeto informando que é false e ocorreu uma falha.
        }
    }

    async delete(id){
       
        var user = await this.findById(id) // buscando por id o usuario;
        if(user != undefined){ // verificando se o usuario existe no banco de dados de acordo com o id.
            try {
                await knex.delete().where({id: id}).table('users') // fazedno o query, de deleção where(onde) id: id, se existir o status é true e se não false e mensagem de erro.
                return {status: true}
            } catch (error) {
                return {status: false, error: error}
            }
            
        }else{
            return { status: false, err: 'O usuario não existe!'}
        }
    }

    /**
     * 
     * @param {*} newPassword 
     * @param {*} id 
     * @param {*} token 
     * 
     * Função para alteração de senha. 
     * 
     * esperando como parametro a nova senha, o id do usuario e o token que vai ser utilizado.
     * è passado então a nova senha em seguida é feito essa alteração e após isso, informamos a tabela de passwordtokens que aquele token do usuario , foi usado passando assim de 0 para 1 !
     */
    async changePassword(newPassword,id,token){
        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table('users');
        await PasswordToken.setUsed(token)
    }



}

module.exports = new User()