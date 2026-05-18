import { Injectable } from '@nestjs/common';
import { createCollection } from './services/createCollection.service';
import { getAllCollections } from './services/getAllCollections.service';
import { getCollectionById } from './services/getCollectionById.service';
import { updateCollection } from './services/updateCollection.service';
import { deleteCollection } from './services/deleteCollection.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
} from './dto/createCollection.dto';

@Injectable()
export class CollectionService {
  constructor() {}

  async createCollectionService(dto: CreateCollectionDto, creatorId: string) {
    return createCollection(dto, creatorId);
  }

  async getAllCollectionsService(creatorId: string) {
    return getAllCollections(creatorId);
  }

  async getCollectionByIdService(id: string, creatorId: string) {
    return getCollectionById(id, creatorId);
  }

  async updateCollectionService(
    id: string,
    dto: Partial<UpdateCollectionDto>,
    creatorId: string,
  ) {
    return updateCollection(id, dto, creatorId);
  }

  async deleteCollectionService(id: string, creatorId: string) {
    return deleteCollection(id, creatorId);
  }
}
