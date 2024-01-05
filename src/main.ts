import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const serveStaticOptions = {
  //   rootPath: path.join(__dirname, `../../uploads`),
  //   exclude: ['api/'],
  // };

  // app.use(
  //   `/${'uploads'}`,
  //   (req, res, next) => {
  //     if (/\.(png|pdf)$/.test(req.path)) {
  //       res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  //     }
  //     next();
  //   },
  //   express.static(serveStaticOptions.rootPath)
  // );

  await app.listen(3000);
}
bootstrap();
