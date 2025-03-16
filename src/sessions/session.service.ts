import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sessions } from '../utils/typeorm';
import { ISessionService } from './session';

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    @InjectRepository(Sessions)
    private sessionRepository: Repository<Sessions>,
  ) {}

  getSessionRepository() {
    return this.sessionRepository;
  }
}
