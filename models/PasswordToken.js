const { dateToString } = require('sqlstring')
var knex = require('../database/connection')
var User = require('./User')

class PasswordToken {

    /**
     * Função create para a verificação de email valido e recuperação de senha
     * @param {*} email 
     * @returns 
     * 
     * Primeiro é feito uma busca em findByEmail(email), para verificar se o email existe
     * Se caso existir então vamos inserir no banco de dados a informação do usuario no caso o seu id vai ser criado por padrão o used 0 porque aquele token não foi utilizado. e é gerado o token e prenchido tambem no banco a informação.
     * 
     * Nesse caso o  token é defino com a hora atual com o metodo Date.now(), mas poderia ser facilmente implemnetado com UUID biblioteca .
     * 
     */

    async create(email) {
        var user = await User.findByEmail(email)
        if (user != undefined) {

            try {
                var token = Date.now()
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token // Pode usar UUID (biblioteca)
                }).table('passwordtokens')
                return { status: true, token: token }
            } catch (error) {
                console.log(error)
                return { status: false, error: error }
            }

        } else {
            return { status: false, err: 'O email informado não existe no banco de dados' }
        }
    }

    /**
     * 
     * @param {*} token 
     * @returns 
     * 
     * Validando token , ver se ele existe e ele não foi usado ainda!
     * 
     */

    async validate(token) {

        try {
            var result = await knex.select().where({ token: token }).table('passwordtokens')

            if (result.length > 0) {
                var tk = result[0]
                if (tk.used) {
                    return {status: false} // se foi usado 
                } else {
                    return {status: true, token: tk} // se não foi usado 
                }
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
            return false;
        }
    }


    /**
     * 
     * @param {*} token 
     * 
     * Metodo para informa a tabela passwordtokens que o token do usuario foi usado. passando de 0 para 1 e passando o token usado . 
     */
    async setUsed(token){
        await knex.update({used: 1}).where({token: token}).table("passwordtokens")
    }
}

module.exports = new PasswordToken()