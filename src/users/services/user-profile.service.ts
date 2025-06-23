import { Injectable } from '@nestjs/common';
import { IUserProfile } from '../interfaces/user-profile';
import { Profile, User } from 'src/utils/typeorm';
import { UpdateUserProfileParams } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { deleteFile, processImage } from '../../utils/helpers';

@Injectable()
export class UserProfileService implements IUserProfile {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createProfile() {
    const newProfile = this.profileRepository.create();
    return this.profileRepository.save(newProfile);
  }

  async updateProfile(user: User, params: UpdateUserProfileParams) {
    if (params.avatar)
      user.profile.avatar = await this.updateAvatar(params.avatar , user.profile.avatar);
    if (params.banner)
      user.profile.banner = await this.updateBanner(params.banner , user.profile.banner);
    if (params.about) user.profile.about = params.about;
    return this.userRepository.save(user);
  }

  private async updateBanner(
    newBanner: Express.Multer.File,
    oldBanner?: any,
  ) {
    if (oldBanner) {
      deleteFile(oldBanner, 'users/banners');
    }
    return processImage(newBanner.buffer, 'users/banners');
  }

  private async updateAvatar(
    newAvatar: Express.Multer.File,
    oldAvatar?: any,
  ) {
    if (oldAvatar) {
      deleteFile(oldAvatar, 'users/avatars');
    }
    return processImage(newAvatar.buffer, 'users/avatars');
  }

  async createProfileOrUpdate(user: User, params: UpdateUserProfileParams) {
    if (!user['profile']) {
      user.profile = await this.createProfile();
      return this.updateProfile(user, params);
    }
    return this.updateProfile(user, params);
  }
}
