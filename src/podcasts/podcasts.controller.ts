import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { Episode } from './podcasts.interface';
import { PodcastsService } from './podcasts.service';

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Get('feed')
  async getFeedEpisodes(
    @Query('feedUrl') feedUrl: string,
    @Query('checksumCount') checksumCount: number,
  ): Promise<Episode[]> {
    try {
      return await this.podcastsService.getFeedEpisodes(feedUrl, checksumCount);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Get('episodeTags')
  async getEpisodeTags(@Query('episodeUrl') episodeUrl: string) {
    return await this.podcastsService.getEpisodeTags(episodeUrl);
  }
}
