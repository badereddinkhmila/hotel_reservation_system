import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserCreateDTO } from 'src/intranet/user/dto/user-create.dto';
import { UserReadDTO } from 'src/intranet/user/dto/user-read.dto';
import { UserService } from 'src/intranet/user/service/user.service';
import { UserSigninDTO } from '../../../intranet/user/dto/user-signin.dto';
import { AuthentificationService } from 'src/utils/authentification/authentification.service';
import { LoginResponseDto } from 'src/utils/authentification/dto/login-response.dto';
import { TokenGuard } from 'src/utils/authentification/jwt/guards/token.guard';
import { RefreshTokenGuard } from 'src/utils/authentification/jwt/guards/refresh-token.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthGoogleService } from 'src/utils/authentification/google/authGoogle.service';
import { AuthProvidersEnum } from 'src/utils/authentification/enum/auth-providers.enum';

@Controller({
  //  version: '1',
})
export class AuthentificationController {
  private readonly logger = new Logger(AuthentificationController.name);
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly authService: AuthentificationService,
    @Inject() private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Post('signin')
  async signin(
    @Body() userSignInDTO: UserSigninDTO,
  ): Promise<LoginResponseDto> {
    return await this.authService.validateLogin(userSignInDTO);
  }

  @Get('signout')
  signout(): string {
    return 'signout';
  }

  @Post('signup')
  async signup(@Body() userCreateDTO: UserCreateDTO): Promise<UserReadDTO> {
    const response = await this.userService.registerNewUser(userCreateDTO);
    await this.authService.registerUser(response);
    return response;
  }

  @Post('signup/google')
  async signupGoogle(
    @Body() body: { googleAccessToken: string },
  ): Promise<LoginResponseDto> {
    const userData = await this.authGoogleService.getUserProfile(
      body.googleAccessToken,
    );
    return await this.authService.validateSocialLogin(
      AuthProvidersEnum.google,
      userData,
    );
  }

  @Get('me')
  me(): number[] {
    return [1, 2, 3];
  }

  @Get('users')
  @UseGuards(TokenGuard)
  @HttpCode(HttpStatus.OK)
  async all(): Promise<UserReadDTO[]> {
    try {
      return await this.userService.getAll();
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get('/users/:user_id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('user_id') userId: string): Promise<UserReadDTO> {
    return await this.userService.getById(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh_token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() request: any): Promise<LoginResponseDto> {
    this.logger.debug(request.user);
    return await this.authService.refreshToken(request.user);
  }

  @Get('confirm_email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(@Query('hash') hash: string): Promise<void> {
    await this.authService.confirmUserEmail(hash);
  }

  // @Get('send_email')
  // @HttpCode(HttpStatus.OK)
  // async sendEmail(): Promise<SentMessageInfo> {
  //   return await this.authService.sendEmailConfirmation(
  //     'badreddine',
  //     'kamara',
  //     'khmila.badreddin@gmail.com',
  //   );
  // }

  @MessagePattern('confirmation_email')
  async handleMessage(@Payload() data: string): Promise<void> {
    try {
      const payload = JSON.parse(data) as {
        hash: string;
        firstname: string;
        lastname: string;
        email: string;
        companyname: string;
        contactemail: string;
      };
      await this.authService.sendEmailConfirmation(payload);
    } catch (error) {
      this.logger.log('[handleMessage]', error);
    }
  }
}
