import { Injectable } from '@nestjs/common';
import got from 'got';
import * as mm from 'music-metadata/lib/core';
import { Episode } from './podcasts.interface';
import { XMLParser } from 'fast-xml-parser';
import { pipeline } from 'stream';
import { createHash } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class PodcastsService {
  async getFeedEpisodes(
    feedUrl: string,
    checksumCount = 1,
  ): Promise<Episode[]> {
    const episodes: Episode[] = [];

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    // Fetch RSS feed data & parse
    try {
      const feedBuffer = await got.get(feedUrl).buffer();

      const { rss } = parser.parse(feedBuffer);

      let idx = 0;

      for (const item of rss.channel.item) {
        const fileChecksum =
          idx <= checksumCount - 1
            ? await this.createRemoteFileHash(item.enclosure['@_url'])
            : '';

        episodes.push({
          title: item.title,
          url: item.link,
          checksum: fileChecksum,
        });

        idx++;
      }

      return episodes;
    } catch (error) {
      console.error(error.message);
      throw new Error('Invalid Feed URL');
    }
  }

  async createRemoteFileHash(fileUrl: string): Promise<string> {
    const streamPipeline = promisify(pipeline);

    const downloadStream = got.stream(fileUrl);

    const hashWriterStream = createHash('md5');
    hashWriterStream.setEncoding('hex');

    try {
      // Pipe data to hash
      await streamPipeline(downloadStream, hashWriterStream);
      return hashWriterStream.read();
    } catch (error) {
      console.error(error);
      throw new Error('Invalid Episode URL');
    }
  }

  async getEpisodeTags(episodeUrl: string) {
    try {
      // Fetch mp3 data
      const episodeBuffer = await got.get(episodeUrl).buffer();
      // Parse ID3 tags
      const metadata = await mm.parseBuffer(episodeBuffer, 'audio/mpeg');

      return metadata;
    } catch (error) {
      console.error(error.message);
      throw new Error('Invalid Episode URL');
    }
  }
}
