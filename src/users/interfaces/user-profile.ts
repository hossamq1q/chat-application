import { Profile, User } from "../../utils/typeorm";
import { UpdateUserProfileParams } from '../../utils/types';


export interface IUserProfile {
  createProfile():Promise<Profile>;
  updateProfile(user: User, params: UpdateUserProfileParams):Promise<User>;
  createProfileOrUpdate(user: User, params: UpdateUserProfileParams);
}
