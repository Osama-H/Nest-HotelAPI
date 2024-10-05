import { Test, TestingModule } from '@nestjs/testing';
import { HotelPhotoController } from './hotel-photo.controller';

describe('HotelPhotoController', () => {
  let controller: HotelPhotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelPhotoController],
    }).compile();

    controller = module.get<HotelPhotoController>(HotelPhotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
