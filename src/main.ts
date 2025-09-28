import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Validation_Pipe } from "./pipes/validation.pipe";

async function start() {
  const PORT = process.env.PORT || 500;
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.use(bodyParser.json({ limit: '5mb' }))
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('ejs')
  app.useGlobalPipes(new Validation_Pipe())
  app.use(cookieParser())

  app.enableCors({
    origin: [
      "*"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Docs API')
    .setDescription(`
      CODE: https://github.com/DemDemi/main
      TG: @DemskisTG
      Email: demskismaili@gmail.com
      HH: https://tbilisi.headhunter.ge/resume/5b8fc329ff0ed0eb070039ed1f435654516f6e
      Name: Demo 
      Хотел бы дописать фронт, используя (EJS + WebSocket) + RabbitMQ
      Но торопился закончить раньше срока, поскольку проверять вам много,
      а мне важно, чтобы проверили именно моё,
      с уважением, дэмо.
      Deploy: Ubuntu Server
      `)
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api-docs', app, swaggerDocument)


  await app.listen(PORT, () => console.log(`Server Start On Post = ${PORT} `))
}

start();
