const User = require('./user');  // Assurez-vous que le chemin vers votre modèle User est correct
if (User) {
    console.log('Le modèle User a été correctement défini.');
} else {
    console.log('Erreur : Le modèle User n\'a pas été défini.');
}

class UserController {
    static async getUserById(id) {
        try {
            const user = await User.findByPk(id);
            return user;
        } catch (error) {
            console.error(`Une erreur s'est produite lors de la récupération de l'utilisateur : ${error}`);
            throw error;
        }
    }

    static async getAllUsers() {
        try {
            const user = await User.findAll();
            
            return user;

        } catch (error) {
            console.error(`Une erreur s'est produite lors de la récupération des utilisateurs : ${error}`);
            throw error;
        }
    }

    

    

    static async createUser(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (error) {
            console.error(`Une erreur s'est produite lors de la création de l'utilisateur : ${error}`);
            throw error;
        }
    }

    static async updateUser(id, data) {
        try {
            const user = await User.update(data, { where: { id: id } });
            return user;
        } catch (error) {
            console.error(`Une erreur s'est produite lors de la mise à jour de l'utilisateur : ${error}`);
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            const user = await User.destroy({ where: { id: id } });
            return user;
        } catch (error) {
            console.error(`Une erreur s'est produite lors de la suppression de l'utilisateur : ${error}`);
            throw error;
        }
    }
}

module.exports = UserController;
