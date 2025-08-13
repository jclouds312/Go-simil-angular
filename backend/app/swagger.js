const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: API Documentation
 *   description: API Documentation using Swagger
 *   version: 1.0.0
 */

/**
 * @swagger
 * tags:
 *   - name: Example
 *     description: Example API endpoints
 */

/**
 * @swagger
 * /example:
 *   get:
 *     tags:
 *       - Example
 *     summary: Get example data
 *     description: Retrieves example data from the API.
 *     responses:
 *       200:
 *         description: Successful response
 */

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InsumoPro - Documentación API',
      description: 'Ejemplos de endpoint´s',
      version: '1.0.0',
    }
  },
  apis: ['./app/ruta/*.js'], // Ruta de los archivos que contienen tus rutas/endpoints
  };

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};