import { Test, TestingModule } from '@nestjs/testing';
import { PodcastsService } from './podcasts.service';

describe('PodcastsService', () => {
  let service: PodcastsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PodcastsService],
    }).compile();

    service = module.get<PodcastsService>(PodcastsService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('should fetch episodes', () => {
    return service
      .getFeedEpisodes('https://rss.acast.com/varvet', 1)
      .then((data) => {
        expect(data.at(-1)).toEqual({
          title: '#1: Soran Ismail',
          url: 'https://play.acast.com/s/varvet/1soranismail',
          checksum: '',
        });
      });
  });

  test('should generate checksum for episode', () => {
    return service
      .createRemoteFileHash(
        'https://open.acast.com/public/streams/bf4e5114-fe02-4088-9a07-c1b81a3c615a/episodes/61a3fadb39ae50001c43fad8.mp3',
      )
      .then((data) => {
        expect(data).toEqual('d93724c075c3f976ccd267236c0bf7e3');
      });
  });
});
