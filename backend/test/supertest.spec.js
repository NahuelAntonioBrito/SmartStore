import * as chai from "chai";
import supertest from "supertest";
import sinon from "sinon";
import app from "../src/app.js";
import ArticuleService from "../src/services/articule.service.js";
import { PORT } from "../src/app.js";

const { expect } = chai;
const requester = supertest(app);

const mockArticules = [
  {
    id_articulo: 1,
    descripcion: "TB.TOBLERONE.1000G.20CA",
    unidad_x_bulto: 20,
    imagen: null,
    fecha_alta: null,
    descripcion_corta: null,
    cod_barra_bulto: "7614500010013",
    cod_barra_unidad: null,
    descripcion_adicional: null,
    minimo_facturacion: 1,
    factor_facturacion: 1,
  },
  {
    id_articulo: 2,
    descripcion: "Otro Articulo",
    unidad_x_bulto: 30,
    imagen: null,
    fecha_alta: null,
    descripcion_corta: null,
    cod_barra_bulto: "1234567890123",
    cod_barra_unidad: null,
    descripcion_adicional: null,
    minimo_facturacion: 2,
    factor_facturacion: 1,
  },
  {
    id_articulo: 3,
    descripcion: "Otro Articulo",
    unidad_x_bulto: 30,
    imagen: null,
    fecha_alta: null,
    descripcion_corta: null,
    cod_barra_bulto: "1234567890123",
    cod_barra_unidad: null,
    descripcion_adicional: null,
    minimo_facturacion: 4,
    factor_facturacion: 1,
  },
];

describe("Testing Adopme", () => {
  before((done) => {
    app.listen(PORT, done); // Inicia el servidor antes de las pruebas
  });

  describe("Test Articules", () => {
    it("El endpoint GET /api/articules debe devolver una lista de artículos", async () => {
      const stub = sinon
        .stub(ArticuleService, "getAllArticules")
        .returns(Promise.resolve(mockArticules));

      const { status, body } = await requester.get("/api/articules");
      expect(status).to.equal(200);
      expect(body).to.be.an("array");
      expect(body).to.deep.equal(mockArticules);

      stub.restore();
    });

    it("El endpoint GET /api/articules debe devolver 500 si hay un error en el servidor", async () => {
      const stub = sinon
        .stub(ArticuleService, "getAllArticules")
        .throws(new Error("Error interno"));

      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        const { status, body } = await requester.get("/api/articules");
        expect(status).to.equal(500);
        expect(body).to.have.property("message", "Error fetching products");
      } finally {
        stub.restore();
        console.error = originalConsoleError;
      }
    });

    it("El endpoint GET /api/articules/99999 debe devolver 404 si no se encuentra el recurso", async () => {
      const stub = sinon
        .stub(ArticuleService, "getArticuleById")
        .returns(Promise.resolve(null));

      const { status, body } = await requester.get("/api/articules/99999");
      expect(status).to.equal(404);
      expect(body).to.have.property("message", "Articule not found");

      stub.restore();
    });
  });

  describe("Test Articules by Amount", () => {
    it("El endpoint GET /api/articules/amount debe devolver una lista de artículos dentro del rango de 'minimo_facturacion'", async () => {
      const stub = sinon
        .stub(ArticuleService, "getArticulesByAmount")
        .returns(
          Promise.resolve(
            mockArticules.filter(
              (a) => a.minimo_facturacion >= 1 && a.minimo_facturacion <= 2
            )
          )
        );

      const min = 1;
      const max = 2;

      const { status, body } = await requester.get(
        `/api/articules/amount?min=${min}&max=${max}`
      );
      expect(status).to.equal(200);
      expect(body).to.be.an("array");
      expect(body).to.deep.equal(
        mockArticules.filter(
          (a) => a.minimo_facturacion >= 1 && a.minimo_facturacion <= 2
        )
      );

      stub.restore();
    });

    it("El endpoint GET /api/articules/amount debe devolver 400 si los valores min o max son inválidos", async () => {
      const { status, body } = await requester.get(
        "/api/articules/amount?min=abc&max=xyz"
      );
      expect(status).to.equal(400);
      expect(body).to.have.property("message", "Invalid min or max values");
    });

    it("El endpoint GET /api/articules/amount debe devolver 500 si hay un error en el servidor", async () => {
      const stub = sinon
        .stub(ArticuleService, "getArticulesByAmount")
        .throws(new Error("Error interno"));

      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        const min = 1;
        const max = 2;

        const { status, body } = await requester.get(
          `/api/articules/amount?min=${min}&max=${max}`
        );
        expect(status).to.equal(500);
        expect(body).to.have.property("message", "Error fetching articule");
      } finally {
        stub.restore();
        console.error = originalConsoleError;
      }
    });
  });

  describe("Test Articules by ID", () => {
    it("El endpoint GET /api/articules/:articuleID debe devolver un artículo específico por su ID", async () => {
      const mockArticule = mockArticules[0];

      const stub = sinon
        .stub(ArticuleService, "getArticuleById")
        .returns(Promise.resolve(mockArticule));

      const articuleID = 1;

      const { status, body } = await requester.get(
        `/api/articules/${articuleID}`
      );
      expect(status).to.equal(200);
      expect(body).to.deep.equal(mockArticule);

      stub.restore();
    });

    it("El endpoint GET /api/articules/:articuleID debe devolver 404 si el artículo no se encuentra", async () => {
      const stub = sinon
        .stub(ArticuleService, "getArticuleById")
        .returns(Promise.resolve(null));

      const articuleID = 99999;

      const { status, body } = await requester.get(
        `/api/articules/${articuleID}`
      );
      expect(status).to.equal(404);
      expect(body).to.have.property("message", "Articule not found");

      stub.restore();
    });

    it("El endpoint GET /api/articules/:articuleID debe devolver 500 si hay un error en el servidor", async () => {
      const stub = sinon
        .stub(ArticuleService, "getArticuleById")
        .throws(new Error("Error interno"));

      const articuleID = 1;

      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        const { status, body } = await requester.get(
          `/api/articules/${articuleID}`
        );
        expect(status).to.equal(500);
        expect(body).to.have.property("message", "Error fetching articule");
      } finally {
        stub.restore();
        console.error = originalConsoleError;
      }
    });
  });

  describe("Test Articules by Name", () => {
    it("El endpoint GET /api/articules/name/:articuleName debe devolver una lista de artículos que coincidan con el nombre", async () => {
      const stub = sinon
        .stub(ArticuleService, "getArticulesByName")
        .returns(
          Promise.resolve(
            mockArticules.filter((a) => a.descripcion.includes("TOBLERONE"))
          )
        );

      const articuleName = "TOBLERONE";

      const { status, body } = await requester.get(
        `/api/articules/name/${articuleName}`
      );
      expect(status).to.equal(200);
      expect(body).to.be.an("array");
      expect(body).to.deep.equal(
        mockArticules.filter((a) => a.descripcion.includes("TOBLERONE"))
      );

      stub.restore();
    });

    it("El endpoint GET /api/articules/name/:articuleName debe devolver 500 si hay un error en el servidor", async () => {
      const stub = sinon
        .stub(ArticuleService, "getArticulesByName")
        .throws(new Error("Error interno"));

      const articuleName = "TOBLERONE";

      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        const { status, body } = await requester.get(
          `/api/articules/name/${articuleName}`
        );
        expect(status).to.equal(500);
        expect(body).to.have.property(
          "message",
          "Error fetching articules by name"
        );
      } finally {
        stub.restore();
        console.error = originalConsoleError;
      }
    });
  });
  describe("Test Add Articule", () => {
    describe("POST /api/articules", () => {
      it("Debe agregar un nuevo artículo y devolver el artículo creado", async () => {
        const newArticule = {
          descripcion: "Nuevo Articulo",
          unidad_x_bulto: 10,
          imagen: null,
          fecha_alta: null,
          descripcion_corta: "Descripción corta",
          cod_barra_bulto: "1234567890123",
          cod_barra_unidad: null,
          descripcion_adicional: "Descripción adicional",
          minimo_facturacion: 1,
          factor_facturacion: 1,
        };

        const mockResponse = { ...newArticule, id_articulo: 4 };

        const stub = sinon
          .stub(ArticuleService, "addArticule")
          .returns(Promise.resolve(mockResponse));

        const { status, body } = await requester
          .post("/api/articules")
          .send(newArticule);
        expect(status).to.equal(201);
        expect(body).to.deep.equal(mockResponse);

        stub.restore();
      });

      it("Debe devolver 500 si ocurre un error al agregar el artículo", async () => {
        const newArticule = {
          descripcion: "Nuevo Articulo",
          unidad_x_bulto: 10,
          imagen: null,
          fecha_alta: null,
          descripcion_corta: "Descripción corta",
          cod_barra_bulto: "1234567890123",
          cod_barra_unidad: null,
          descripcion_adicional: "Descripción adicional",
          minimo_facturacion: 1,
          factor_facturacion: 1,
        };

        const stub = sinon
          .stub(ArticuleService, "addArticule")
          .throws(new Error("Error interno"));

        const originalConsoleError = console.error;
        console.error = () => {};

        try {
          const { status, body } = await requester
            .post("/api/articules")
            .send(newArticule);
          expect(status).to.equal(500);
          expect(body).to.have.property("message", "Error adding articule");
        } finally {
          stub.restore();
          console.error = originalConsoleError;
        }
      });

      it("Debe devolver 400 si el cuerpo de la solicitud está incompleto o es inválido", async () => {
        const invalidArticule = {
          descripcion: "Articulo sin campos necesarios",
          // falta campo obligatorio
        };

        const { status, body } = await requester
          .post("/api/articules")
          .send(invalidArticule);
        expect(status).to.equal(400);
        expect(body).to.have.property("message", "Invalid articule data");
      });
    });
  });
  describe("Test Articules Update", () => {
    it("El endpoint PUT /api/articules/:id debe actualizar un artículo existente", async () => {
      const updatedArticule = {
        descripcion: "Articulo Actualizado",
        unidad_x_bulto: 15,
        imagen: null,
        fecha_alta: null,
        descripcion_corta: "Descripción corta actualizada",
        cod_barra_bulto: "9876543210987",
        cod_barra_unidad: null,
        descripcion_adicional: "Descripción adicional actualizada",
        minimo_facturacion: 2,
        factor_facturacion: 2,
      };

      const mockResponse = { ...updatedArticule, id_articulo: 1 };

      const stub = sinon
        .stub(ArticuleService, "updateArticule")
        .returns(Promise.resolve(mockResponse));

      const articuleID = 1;

      const { status, body } = await requester
        .put(`/api/articules/${articuleID}`)
        .send(updatedArticule);
      expect(status).to.equal(200);
      expect(body).to.deep.equal(mockResponse);

      stub.restore();
    });

    it("El endpoint PUT /api/articules/:id debe devolver 404 si el artículo no se encuentra", async () => {
      const updatedArticule = {
        descripcion: "Articulo Actualizado",
        unidad_x_bulto: 15,
        imagen: null,
        fecha_alta: null,
        descripcion_corta: "Descripción corta actualizada",
        cod_barra_bulto: "9876543210987",
        cod_barra_unidad: null,
        descripcion_adicional: "Descripción adicional actualizada",
        minimo_facturacion: 2,
        factor_facturacion: 2,
      };

      const stub = sinon
        .stub(ArticuleService, "updateArticule")
        .returns(Promise.resolve(null));

      const articuleID = 99999;

      const { status, body } = await requester
        .put(`/api/articules/${articuleID}`)
        .send(updatedArticule);
      expect(status).to.equal(404);
      expect(body).to.have.property("message", "Articule not found");

      stub.restore();
    });

    it("El endpoint PUT /api/articules/:id debe devolver 500 si hay un error en el servidor", async () => {
      const updatedArticule = {
        descripcion: "Articulo Actualizado",
        unidad_x_bulto: 15,
        imagen: null,
        fecha_alta: null,
        descripcion_corta: "Descripción corta actualizada",
        cod_barra_bulto: "9876543210987",
        cod_barra_unidad: null,
        descripcion_adicional: "Descripción adicional actualizada",
        minimo_facturacion: 2,
        factor_facturacion: 2,
      };

      const stub = sinon
        .stub(ArticuleService, "updateArticule")
        .throws(new Error("Error interno"));

      const articuleID = 1;

      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        const { status, body } = await requester
          .put(`/api/articules/${articuleID}`)
          .send(updatedArticule);
        expect(status).to.equal(500);
        expect(body).to.have.property("message", "Error updating articule");
      } finally {
        stub.restore();
        console.error = originalConsoleError;
      }
    });
  });
  describe("Test Articules Delete", () => {
    it("El endpoint DELETE /api/articules/:id debe eliminar un artículo existente", async () => {
      const stub = sinon
        .stub(ArticuleService, "deleteArticule")
        .returns(Promise.resolve(true));

      const articuleID = 1;

      const { status, body } = await requester.delete(
        `/api/articules/${articuleID}`
      );
      expect(status).to.equal(200);
      expect(body).to.have.property("message", "Articule deleted successfully");

      stub.restore();
    });

    it("El endpoint DELETE /api/articules/:id debe devolver 404 si el artículo no se encuentra", async () => {
      const stub = sinon
        .stub(ArticuleService, "deleteArticule")
        .returns(Promise.resolve(false));

      const articuleID = 99999;

      const { status, body } = await requester.delete(
        `/api/articules/${articuleID}`
      );
      expect(status).to.equal(404);
      expect(body).to.have.property("message", "Articule not found");

      stub.restore();
    });

    it("El endpoint DELETE /api/articules/:id debe devolver 500 si hay un error en el servidor", async () => {
      const stub = sinon
        .stub(ArticuleService, "deleteArticule")
        .throws(new Error("Error interno"));

      const articuleID = 1;

      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        const { status, body } = await requester.delete(
          `/api/articules/${articuleID}`
        );
        expect(status).to.equal(500);
        expect(body).to.have.property("message", "Error deleting articule");
      } finally {
        stub.restore();
        console.error = originalConsoleError;
      }
    });
  });
});
