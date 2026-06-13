import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('ARCHICOPRO Extranet API')
  .setDescription(
    'Official API documentation for the ARCHICOPRO Extranet platform.\n\n' +
      'Use this documentation to explore all endpoints, models, authentication methods, and integration guides.',
  )
  .setVersion('1.1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your JWT token here',
    },
    'access-token',
  )
  // .addServer('http://localhost:5000', 'Local Development')
  .build();

export const swaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
  customSiteTitle: 'ARCHICOPRO Extranet API Docs',
  customCss: `
      .swagger-ui .topbar { background-color: #111827 !important; }
      .topbar-wrapper img { content: url('/logo.svg'); width: 140px; }
    `,
};
