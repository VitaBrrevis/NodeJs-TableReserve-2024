import { Controller, Get, Post, Body, Render, UploadedFile, UseInterceptors, Redirect, Res, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request, Express } from 'express';
import { RestaurantService } from '../services/restaurant.service';  

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('/registration')
  @Render('restaurant-register')
  showRegistrationPage() {
    return {};
  }

  @Post('/submit-registration')
  @UseInterceptors(FileInterceptor('photo'))
  async registerRestaurant(
    @Body() body: Request['body'],
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    const { establishmentName, email, phone, socialMedia, website } = body;

    let photoPath = null;
    try {
      if (file) {
        photoPath = await this.restaurantService.uploadPhoto(file);
      }

      await this.restaurantService.insertRestaurantData(establishmentName, email, phone, socialMedia, website, photoPath);

    
      return res.redirect('/'); // потрібно буде змінити редірект на /booking коли буде готова ця сторінка
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  @Get()
  async getAllRestaurants() {
    return await this.restaurantService.getAllRestaurants();
  }

  @Get(':id')
  async getRestaurantById(@Param('id') id: string) {
    const restaurant = await this.restaurantService.getRestaurantById(id);
    if (!restaurant) {
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    }
    return restaurant;
  }
}
