import LiderApi from './api/liderApi';

class LiderService {
    static async getAllLideres() {
        try {
            const response = await LiderApi.getAll();
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar líderes:', error);
            throw error;
        }
    }

    static async getLiderById(id) {
        try {
            const response = await LiderApi.getById(id);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar líder ${id}:`, error);
            throw error;
        }
    }

    static async createLider(liderData) {
        try {
            const response = await LiderApi.create(liderData);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar líder:', error);
            throw error;
        }
    }

    static async updateLider(id, liderData) {
        try {
            const response = await LiderApi.update(id, liderData);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar líder ${id}:`, error);
            throw error;
        }
    }

    static async deleteLider(id) {
        try {
            const response = await LiderApi.delete(id);
            return response.data;
        } catch (error) {
            console.error(`Erro ao deletar líder ${id}:`, error);
            throw error;
        }
    }
}

export default LiderService;
