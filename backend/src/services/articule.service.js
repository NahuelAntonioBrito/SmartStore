import { pool } from "../database/connectionPostgreSQL.js";

class ArticuleService {
  async getAllArticules() {
    const result = await pool.query("SELECT * FROM articulos");
    return result.rows;
  }

  async getArticuleById(id) {
    const result = await pool.query(
      "SELECT * FROM articulos WHERE id_articulo = $1",
      [id]
    );
    return result.rows[0];
  }

  async getArticulesByName(name) {
    const result = await pool.query(
      "SELECT * FROM articulos WHERE descripcion ILIKE $1",
      [`%${name}%`]
    );
    return result.rows;
  }

  async getArticulesByAmount(min, max) {
    const result = await pool.query(
      "SELECT * FROM articulos WHERE minimo_facturacion BETWEEN $1 AND $2",
      [min, max]
    );
    return result.rows;
  }

  async addArticule(articule) {
    const {
      descripcion,
      unidad_x_bulto,
      imagen,
      fecha_alta,
      descripcion_corta,
      cod_barra_bulto,
      cod_barra_unidad,
      descripcion_adicional,
      minimo_facturacion,
      factor_facturacion,
    } = articule;

    const result = await pool.query(
      "INSERT INTO articulos (descripcion, unidad_x_bulto, imagen, fecha_alta, descripcion_corta, cod_barra_bulto, cod_barra_unidad, descripcion_adicional, minimo_facturacion, factor_facturacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        descripcion,
        unidad_x_bulto,
        imagen,
        fecha_alta,
        descripcion_corta,
        cod_barra_bulto,
        cod_barra_unidad,
        descripcion_adicional,
        minimo_facturacion,
        factor_facturacion,
      ]
    );

    return result.rows[0];
  }

  async updateArticule(id, articule) {
    const {
      descripcion,
      unidad_x_bulto,
      imagen,
      fecha_alta,
      descripcion_corta,
      cod_barra_bulto,
      cod_barra_unidad,
      descripcion_adicional,
      minimo_facturacion,
      factor_facturacion,
    } = articule;

    const result = await pool.query(
      "UPDATE articulos SET descripcion = $1, unidad_x_bulto = $2, imagen = $3, fecha_alta = $4, descripcion_corta = $5, cod_barra_bulto = $6, cod_barra_unidad = $7, descripcion_adicional = $8, minimo_facturacion = $9, factor_facturacion = $10 WHERE id_articulo = $11 RETURNING *",
      [
        descripcion,
        unidad_x_bulto,
        imagen,
        fecha_alta,
        descripcion_corta,
        cod_barra_bulto,
        cod_barra_unidad,
        descripcion_adicional,
        minimo_facturacion,
        factor_facturacion,
        id,
      ]
    );

    return result.rows[0];
  }

  async deleteArticule(id) {
    const result = await pool.query(
      "DELETE FROM articulos WHERE id_articulo = $1 RETURNING *",
      [id]
    );

    return result.rows[0];
  }
}

export default new ArticuleService();
