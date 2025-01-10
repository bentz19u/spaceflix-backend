import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { UsersSeederService } from './users/seeder/users-seeder.service'
import { SystemStatesSeederService } from './system-states/seeder/system-states-seeder.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'backend-jwt-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'backend-jwt-refresh',
    )
    .setTitle('Spaceflix APIs')
    .setDescription('Backend APIs consumed by the Spaceflix application(s)')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
    },
  })

  await app.listen(process.env.PORT ?? 3000)

  const configService: ConfigService = app.get(ConfigService)
  if (configService.get('NODE_ENV') === 'LOCAL' && configService.get('DATABASE_SCHEMA') != 'landprime') {
    try {
      console.log(`NODE_ENV 'LOCAL' detected, seeding database.`)

      const systemStatesSeederService = app.get<SystemStatesSeederService>(SystemStatesSeederService)
      const usersSeederService = app.get<UsersSeederService>(UsersSeederService)

      await systemStatesSeederService.seedDatabase()
      await usersSeederService.seedDatabase()

      console.log(`Seeding done.`)
    } catch (error) {
      console.error(error)
    }
  }
}
bootstrap()
