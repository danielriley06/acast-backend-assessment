import { Test, TestingModule } from '@nestjs/testing';
import { PodcastsController } from './podcasts.controller';
import { PodcastsService } from './podcasts.service';

describe('PodcastsController', () => {
  let controller: PodcastsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PodcastsController],
      providers: [PodcastsService],
    }).compile();

    controller = module.get<PodcastsController>(PodcastsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
