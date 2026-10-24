import HttpClient from '@/api/clients/HttpClient';
import { QueryParameters } from '@/api/models/HttpClientModels';
import IGetContractorsQuery from '@/api/models/users/IGetContractorsQuery';
import { IUpdateUserProfileRequest } from '@/api/models/users/IUpdateUserProfileRequest';
import { IUserProfileResponse } from '@/api/models/users/IUserProfileResponse';
import ProfileImageKind from '@/modules/user/models/ProfileImageKind';

const usersConfig = {
  endpoint: 'users',
};

const contractorsConfig = {
  endpoint: 'contractors',
};

export default class UserService {
  usersHttpClient: HttpClient;
  contractorsHttpClient: HttpClient;

  constructor() {
    this.usersHttpClient = new HttpClient(usersConfig.endpoint);
    this.contractorsHttpClient = new HttpClient(contractorsConfig.endpoint);
  }

  getUsersAsync = async (query: QueryParameters = {}) => {
    return this.usersHttpClient.findAsync<IUserProfileResponse[]>(query);
  };

  getUserAsync = async (id: string) => {
    return this.usersHttpClient.getAsync<IUserProfileResponse>(id);
  };

  getContractorsAsync = async (query: IGetContractorsQuery = {}) => {
    return this.contractorsHttpClient.findAsync<IUserProfileResponse[]>(query);
  };

  updateCurrentUserAsync = async (model: IUpdateUserProfileRequest) => {
    return this.usersHttpClient.putAsync<IUserProfileResponse, IUpdateUserProfileRequest>('me', model);
  };

  uploadCurrentUserImageAsync = (kind: ProfileImageKind, file: File, onProgress: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    return this.usersHttpClient.postAsync<IUserProfileResponse, FormData>(formData, `me/images/${kind}`, {
      // Override the shared JSON header; the browser supplies the multipart boundary.
      headers: { 'Content-Type': undefined },
      onUploadProgress: (event) => {
        if (event.total) onProgress(Math.round((event.loaded / event.total) * 100));
      },
    });
  };

  deleteCurrentUserImageAsync = (kind: ProfileImageKind) => {
    return this.usersHttpClient.deleteAsync<IUserProfileResponse>('me', `images/${kind}`);
  };
}
