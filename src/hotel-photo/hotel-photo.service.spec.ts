import { Test, TestingModule } from '@nestjs/testing';
import { HotelPhotoService } from './hotel-photo.service';

describe('HotelPhotoService', () => {
  let service: HotelPhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelPhotoService],
    }).compile();

    service = module.get<HotelPhotoService>(HotelPhotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
