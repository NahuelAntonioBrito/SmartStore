import ArticuleService from "../services/articule.service.js";

class ArticuleController {
  // Obtener todos los artículos
  async getArticules(req, res) {
    try {
      const articules = await ArticuleService.getAllArticules();
      res.status(200).json(articules);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error fetching products",
        error: error.message || error,
      });
    }
  }

  // Obtener un artículo por ID
  async getById(req, res) {
    try {
      const { articuleID } = req.params;
      const articule = await ArticuleService.getArticuleById(articuleID);
      if (!articule) {
        return res.status(404).json({ message: "Articule not found" });
      }
      res.json(articule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching articule", error });
    }
  }

  // Obtener artículos por nombre (descripción)
  async getByName(req, res) {
    try {
      const articuleName = req.params.articuleName;
      const articules = await ArticuleService.getArticulesByName(articuleName);
      res.json(articules);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error fetching articules by name", error });
    }
  }

  // Obtener artículos por rango de monto (mínimo y máximo de facturación)
  async getByAmount(req, res) {
    try {
      const min = req.query.min;
      const max = req.query.max;

      // Convertir los parámetros a enteros
      const minValue = parseInt(min, 10);
      const maxValue = parseInt(max, 10);

      // Validar que los parámetros sean números enteros válidos
      if (isNaN(minValue) || isNaN(maxValue)) {
        return res.status(400).json({ message: "Invalid min or max values" });
      }

      const articules = await ArticuleService.getArticulesByAmount(
        minValue,
        maxValue
      );

      res.status(200).json(articules);
    } catch (error) {
      console.error("Error fetching articule", error);
      res.status(500).json({
        message: "Error fetching articule",
        error: error.message || error,
      });
    }
  }

  // Agregar un nuevo artículo
  async addArticule(req, res) {
    try {
      const articule = req.body;
      const newArticule = await ArticuleService.addArticule(articule);
      res.status(201).json(newArticule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding articule", error });
    }
  }

  // Actualizar un artículo existente
  async updateArticule(req, res) {
    try {
      const { articuleID } = req.params;
      const articule = req.body;

      const updatedArticule = await ArticuleService.updateArticule(
        articuleID,
        articule
      );

      if (!updatedArticule) {
        return res.status(404).json({ message: "Articule not found" });
      }

      res.json(updatedArticule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating articule", error });
    }
  }

  // Eliminar un artículo
  async deleteArticule(req, res) {
    try {
      const { articuleID } = req.params;

      const deletedArticule = await ArticuleService.deleteArticule(articuleID);

      if (!deletedArticule) {
        return res.status(404).json({ message: "Articule not found" });
      }

      res.json({
        message: "Articule deleted successfully",
        articule: deletedArticule,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting articule", error });
    }
  }
}

export default new ArticuleController();
