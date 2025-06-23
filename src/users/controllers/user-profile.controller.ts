import { Body, Controller, Inject, Patch, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { Routes, Services, UserProfileFileFields } from "../../utils/constants";
import { IUserProfile } from '../interfaces/user-profile';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { AuthUser } from "../../utils/decorator";
import { User } from "../../utils/typeorm";
import { UpdateUserProfileDto } from "../dtos/UpdateUserProfile.dto";
import { UpdateUserProfileParams, UserProfileFiles } from "../../utils/types";
import { AuthenticatedGuard } from "../../auth/utils/guards";

@Controller(Routes.USERS_PROFILES)
@UseGuards(AuthenticatedGuard)
export class UserProfilesController {
  constructor(
    @Inject(Services.USERS_PROFILES)
    private readonly userProfileService: IUserProfile,
  ) {}

  @Patch()
  @UseInterceptors(FileFieldsInterceptor(UserProfileFileFields))
  async updateUserProfile(
    @AuthUser() user: User,
    @UploadedFiles()
    files: UserProfileFiles,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const params: UpdateUserProfileParams = {};
    updateUserProfileDto.about && (params.about = updateUserProfileDto.about);
    files.banner && (params.banner = files.banner[0]);
    files.avatar && (params.avatar = files.avatar[0]);
    return this.userProfileService.createProfileOrUpdate(user, params);
  }
}
