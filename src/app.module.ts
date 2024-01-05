import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './modules/email/email.module';


@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [EmailModule],
})
export class AppModule {}
