import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import IGetContractorsQuery from '@/api/models/users/IGetContractorsQuery';
import { IUpdateUserProfileRequest } from '@/api/models/users/IUpdateUserProfileRequest';
import { IUserProfileResponse } from '@/api/models/users/IUserProfileResponse';
import RootStore from '@/core/stores/RootStore';
import { JOB_CATEGORIES, JobCategory } from '@/modules/marketplace/jobs/constants/jobCategories';
import { IUserProfile } from '@/modules/user/models/IUserProfile';
import { LegalType } from '@/modules/user/models/LegalType';
import UserService from '@/modules/user/services/UserService';
import ProfileImageKind from '@/modules/user/models/ProfileImageKind';

type ContractorLegalTypeFilter = 'ALL' | LegalType;
export type ContractorSort = 'rating' | 'reviews' | 'name';

export default class UserStore {
  rootStore: RootStore;
  userService: UserService;
  users: IUserProfile[] = [];
  isLoadingUsers = false;
  isLoadingContractors = false;
  isSavingProfile = false;
  userListError: string | null = null;
  contractorListError: string | null = null;
  selectedUserError: string | null = null;
  profileSaveError: string | null = null;
  savingProfileImageKind: ProfileImageKind | null = null;
  profileImageUploadProgress = 0;
  profileImageErrors: Partial<Record<ProfileImageKind, string>> = {};
  contractorSearchInputValue = '';
  contractorSearchQuery = '';
  selectedContractorCategories: JobCategory[] = [];
  selectedContractorLocation = '';
  selectedContractorLegalType: ContractorLegalTypeFilter = 'ALL';
  minContractorRating = 0;
  contractorSort: ContractorSort = 'rating';
  private contractorRequestId = 0;
  private knownContractorLocations: string[] = [];
  profileDisplayName = '';
  profileLegalType: LegalType = 'FIRMA';
  profilePhone = '';
  profileIsPhoneVisible = false;
  profileBio = '';
  profileLocation = '';
  profileServiceCategories: JobCategory[] = [];
  defaultContractorCategoriesByRole: Record<'INVESTITOR' | 'IZVODJAC', JobCategory[]> = {
    INVESTITOR: ['Fasade'],
    IZVODJAC: [],
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.userService = new UserService();
    makeAutoObservable(this);
  }

  loadUsers = async (role?: 'INVESTITOR' | 'IZVODJAC') => {
    this.isLoadingUsers = true;
    this.userListError = null;

    try {
      const response = await this.userService.getUsersAsync({ role });

      runInAction(() => {
        this.replaceUsers(response.data.map(this.mapUserResponseToModel), role);
      });
    } catch (error) {
      runInAction(() => {
        this.userListError = this.getApiErrorMessage(error, 'Dohvat korisnika nije uspio.');
      });
    } finally {
      runInAction(() => {
        this.isLoadingUsers = false;
      });
    }
  };

  loadContractors = async (query: IGetContractorsQuery = {}) => {
    const requestId = ++this.contractorRequestId;
    this.isLoadingContractors = true;
    this.contractorListError = null;

    try {
      const response = await this.userService.getContractorsAsync(query);

      runInAction(() => {
        if (requestId !== this.contractorRequestId) return;
        const contractors = response.data.map(this.mapUserResponseToModel);
        this.replaceUsers(contractors, 'IZVODJAC');
        this.knownContractorLocations = Array.from(new Set([
          ...this.knownContractorLocations,
          ...contractors.map((contractor) => contractor.location.trim()).filter(Boolean),
        ]));
      });
    } catch (error) {
      runInAction(() => {
        if (requestId !== this.contractorRequestId) return;
        this.contractorListError = this.getApiErrorMessage(error, 'Dohvat izvođača nije uspio.');
      });
    } finally {
      runInAction(() => {
        if (requestId !== this.contractorRequestId) return;
        this.isLoadingContractors = false;
      });
    }
  };

  loadUserById = async (id: string) => {
    if (!id.trim()) {
      return null;
    }

    this.isLoadingUsers = true;
    this.selectedUserError = null;

    try {
      const response = await this.userService.getUserAsync(id);
      const user = this.mapUserResponseToModel(response.data);

      runInAction(() => {
        this.upsertUser(user);
      });

      return user;
    } catch (error) {
      runInAction(() => {
        this.selectedUserError = this.getApiErrorMessage(error, 'Dohvat korisnika nije uspio.');
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoadingUsers = false;
      });
    }
  };

  setContractorSearchInputValue = (value: string) => { this.contractorSearchInputValue = value; };
  setContractorSearchQuery = (value: string) => { this.contractorSearchQuery = value; };
  setSelectedContractorCategories = (value: JobCategory[]) => { this.selectedContractorCategories = value; };
  setSelectedContractorLocation = (value: string) => { this.selectedContractorLocation = value; };
  setSelectedContractorLegalType = (value: ContractorLegalTypeFilter) => { this.selectedContractorLegalType = value; };
  setMinContractorRating = (value: number) => { this.minContractorRating = value; };
  setContractorSort = (value: ContractorSort) => { this.contractorSort = value; };
  setProfileDisplayName = (value: string) => { this.profileDisplayName = value; this.profileSaveError = null; };
  setProfileLegalType = (value: LegalType) => { this.profileLegalType = value; this.profileSaveError = null; };
  setProfilePhone = (value: string) => {
    this.profilePhone = value;
    if (!value.trim()) {
      this.profileIsPhoneVisible = false;
    }
    this.profileSaveError = null;
  };
  setProfileIsPhoneVisible = (value: boolean) => { this.profileIsPhoneVisible = value; this.profileSaveError = null; };
  setProfileBio = (value: string) => { this.profileBio = value; this.profileSaveError = null; };
  setProfileLocation = (value: string) => { this.profileLocation = value; this.profileSaveError = null; };
  setProfileSaveError = (value: string | null) => { this.profileSaveError = value; };

  toggleSelectedContractorCategory = (category: JobCategory) => {
    if (this.selectedContractorCategories.includes(category)) {
      this.selectedContractorCategories = this.selectedContractorCategories.filter((item) => item !== category);
      return;
    }

    this.selectedContractorCategories = [...this.selectedContractorCategories, category];
  };

  toggleProfileServiceCategory = (category: JobCategory) => {
    if (this.profileServiceCategories.includes(category)) {
      this.profileServiceCategories = this.profileServiceCategories.filter((item) => item !== category);
      return;
    }

    this.profileServiceCategories = [...this.profileServiceCategories, category];
  };

  resetContractorFilters = () => {
    this.contractorSearchInputValue = '';
    this.contractorSearchQuery = '';
    this.selectedContractorCategories = [];
    this.selectedContractorLocation = '';
    this.selectedContractorLegalType = 'ALL';
    this.minContractorRating = 0;
    this.contractorSort = 'rating';
  };

  initializeContractorFiltersForCurrentUser = () => {
    const role = this.rootStore.authenticationStore.user?.role;
    if (!role) {
      this.resetContractorFilters();
      return;
    }

    this.selectedContractorCategories = [...this.defaultContractorCategoriesByRole[role]];
  };

  saveCurrentContractorFiltersAsDefault = () => {
    const role = this.rootStore.authenticationStore.user?.role;
    if (!role) {
      return;
    }

    this.defaultContractorCategoriesByRole = {
      ...this.defaultContractorCategoriesByRole,
      [role]: [...this.selectedContractorCategories],
    };
  };

  get contractorLocations() {
    return [...this.knownContractorLocations].sort((a, b) => a.localeCompare(b, 'hr'));
  }

  getUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  get contractorProfiles() {
    return this.users.filter((user) => user.role === 'IZVODJAC');
  }

  getContractorAverageRating = (contractorId: string) => {
    const reviews = this.rootStore.reviewStore.reviews.filter((review) => review.revieweeId === contractorId);
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  };

  getContractorReviewCount = (contractorId: string) => {
    return this.rootStore.reviewStore.reviews.filter((review) => review.revieweeId === contractorId).length;
  };

  get filteredContractors() {
    const { isLoadingReviews, reviewListError } = this.rootStore.reviewStore;
    const canUseRatings = !isLoadingReviews && !reviewListError;

    return this.contractorProfiles
      .filter((contractor) => {
        if (!canUseRatings) return true;
        const avgRating = this.getContractorAverageRating(contractor.id);
        if (avgRating < this.minContractorRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const nameDifference = a.displayName.localeCompare(b.displayName, 'hr', { sensitivity: 'base' });
        const nameOrder = nameDifference || a.id.localeCompare(b.id);
        if (!canUseRatings || this.contractorSort === 'name') return nameOrder;

        const ratingDifference = this.getContractorAverageRating(b.id) - this.getContractorAverageRating(a.id);
        const reviewCountDifference = this.getContractorReviewCount(b.id) - this.getContractorReviewCount(a.id);
        return this.contractorSort === 'reviews'
          ? reviewCountDifference || ratingDifference || nameOrder
          : ratingDifference || reviewCountDifference || nameOrder;
      });
  }

  get availableServiceCategories() {
    return JOB_CATEGORIES;
  }

  get isProfileFormValid() {
    const normalizedPhone = this.profilePhone.trim();
    const isPhoneValid = normalizedPhone.length >= 6;

    return this.profileDisplayName.trim().length >= 2
      && isPhoneValid
      && this.profileLocation.trim().length >= 2
      && this.profileBio.trim().length >= 10;
  }

  initializeProfileForm = (user: IUserProfile) => {
    this.profileDisplayName = user.displayName;
    this.profileLegalType = user.legalType;
    this.profilePhone = user.phone || '';
    this.profileIsPhoneVisible = user.isPhoneVisible ?? false;
    this.profileBio = user.bio;
    this.profileLocation = user.location;
    this.profileServiceCategories = [...(user.serviceCategories || [])];
    this.profileSaveError = null;
    this.profileImageErrors = {};
  };

  resetProfileForm = () => {
    const authenticatedUserId = this.rootStore.authenticationStore.user?.id;
    if (!authenticatedUserId) {
      this.profileDisplayName = '';
      this.profileLegalType = 'FIRMA';
      this.profilePhone = '';
      this.profileIsPhoneVisible = false;
      this.profileBio = '';
      this.profileLocation = '';
      this.profileServiceCategories = [];
      this.profileSaveError = null;
      return;
    }

    const currentUser = this.getUserById(authenticatedUserId);
    if (currentUser) {
      this.initializeProfileForm(currentUser);
      return;
    }

    this.profileSaveError = null;
  };

  submitCurrentUserProfile = async () => {
    const authenticatedUser = this.rootStore.authenticationStore.user;
    if (!authenticatedUser) {
      this.profileSaveError = 'Morate biti prijavljeni za ažuriranje profila.';
      return false;
    }

    if (!this.isProfileFormValid) {
      this.profileSaveError = 'Provjerite obavezna polja profila.';
      return false;
    }

    this.isSavingProfile = true;
    this.profileSaveError = null;

    try {
      const request: IUpdateUserProfileRequest = {
        displayName: this.profileDisplayName.trim(),
        legalType: this.profileLegalType,
        phone: this.profilePhone.trim(),
        isPhoneVisible: this.profileIsPhoneVisible,
        bio: this.profileBio.trim(),
        location: this.profileLocation.trim(),
        serviceCategories: authenticatedUser.role === 'IZVODJAC' ? this.profileServiceCategories : undefined,
      };

      const response = await this.userService.updateCurrentUserAsync(request);
      const updatedUser = this.mapUserResponseToModel(response.data);

      runInAction(() => {
        this.upsertUser(updatedUser);
        this.rootStore.authenticationStore.updateCurrentUserProfile({
          displayName: updatedUser.displayName,
          legalType: updatedUser.legalType,
          email: updatedUser.email,
          phone: updatedUser.phone,
          isPhoneVisible: updatedUser.isPhoneVisible,
        });
        this.initializeProfileForm(updatedUser);
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.profileSaveError = this.getApiErrorMessage(error, 'Ažuriranje profila nije uspjelo.');
      });
      return false;
    } finally {
      runInAction(() => {
        this.isSavingProfile = false;
      });
    }
  };

  uploadCurrentUserImage = async (kind: ProfileImageKind, file: File) => {
    return this.saveCurrentUserImage(kind, file);
  };

  removeCurrentUserImage = async (kind: ProfileImageKind) => {
    return this.saveCurrentUserImage(kind);
  };

  clearProfileImageError = (kind: ProfileImageKind) => {
    this.profileImageErrors = { ...this.profileImageErrors, [kind]: undefined };
  };

  private saveCurrentUserImage = async (kind: ProfileImageKind, file?: File) => {
    if (!this.rootStore.authenticationStore.user || this.savingProfileImageKind) return false;
    this.savingProfileImageKind = kind;
    this.profileImageUploadProgress = 0;
    this.clearProfileImageError(kind);

    try {
      const response = file
        ? await this.userService.uploadCurrentUserImageAsync(kind, file, (progress) => {
          runInAction(() => { this.profileImageUploadProgress = progress; });
        })
        : await this.userService.deleteCurrentUserImageAsync(kind);

      runInAction(() => {
        // The response contains the complete owner profile, including the private phone.
        // Keep text form state untouched while a photograph is saved.
        this.upsertUser(this.mapUserResponseToModel(response.data));
        this.rootStore.homeStore.updateProfile(response.data);
      });
      return true;
    } catch (error) {
      runInAction(() => {
        this.profileImageErrors = {
          ...this.profileImageErrors,
          [kind]: this.getApiErrorMessage(error, file ? 'Spremanje slike nije uspjelo. Pokušajte ponovno.' : 'Uklanjanje slike nije uspjelo. Pokušajte ponovno.'),
        };
      });
      return false;
    } finally {
      runInAction(() => { this.savingProfileImageKind = null; });
    }
  };

  private mapUserResponseToModel = (userResponse: IUserProfileResponse): IUserProfile => {
    return {
      ...userResponse,
      serviceCategories: userResponse.serviceCategories as JobCategory[] | undefined,
      joinedAt: new Date(userResponse.joinedAt),
    };
  };

  private replaceUsers = (users: IUserProfile[], role?: 'INVESTITOR' | 'IZVODJAC') => {
    if (!role) {
      this.users = users;
      return;
    }

    const filteredExistingUsers = this.users.filter((user) => user.role !== role);
    this.users = [...filteredExistingUsers, ...users];
  };

  private upsertUser = (user: IUserProfile) => {
    const existingUserIndex = this.users.findIndex((existingUser) => existingUser.id === user.id);

    if (existingUserIndex === -1) {
      this.users = [user, ...this.users];
      return;
    }

    const nextUsers = [...this.users];
    nextUsers[existingUserIndex] = user;
    this.users = nextUsers;
  };

  private getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || fallbackMessage;
  };
}
