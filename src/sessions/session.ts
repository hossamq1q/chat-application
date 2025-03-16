import { Repository } from 'typeorm';
import { Sessions } from "../utils/typeorm";

export interface ISessionService {
  getSessionRepository():Repository<Sessions>;
}
