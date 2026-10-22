import { AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { IJobResponse } from '@/api/models/jobs/IJobResponse';
import { IUserProfileResponse } from '@/api/models/users/IUserProfileResponse';
import RootStore from '@/core/stores/RootStore';
import JobService from '@/modules/marketplace/jobs/services/JobService';
import UserService from '@/modules/user/services/UserService';

export default class HomeStore {
  rootStore: RootStore;
  jobService = new JobService();
  userService = new UserService();
  jobs: IJobResponse[] = [];
  contractors: IUserProfileResponse[] = [];
  ownProfile: IUserProfileResponse | null = null;
  isLoadingJobs = false;
  isLoadingContractors = false;
  isLoadingProfile = false;
  jobsError: string | null = null;
  contractorsError: string | null = null;
  profileError: string | null = null;
  private jobsRequest: Promise<void> | null = null;
  private contractorsRequest: Promise<void> | null = null;
  private profileRequest: Promise<void> | null = null;
  private requestedProfileId: string | undefined;
  private profileRequestSequence = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable<this, 'jobsRequest' | 'contractorsRequest' | 'profileRequest'>(this, {
      rootStore: false,
      jobService: false,
      userService: false,
      jobsRequest: false,
      contractorsRequest: false,
      profileRequest: false,
    });
  }

  loadHome = async (userId?: string) => {
    await Promise.all([this.loadJobs(), this.loadContractors(), this.loadOwnProfile(userId)]);
  };

  loadJobs = (): Promise<void> => {
    if (this.jobsRequest) return this.jobsRequest;
    this.isLoadingJobs = true;
    this.jobsError = null;
    this.jobsRequest = this.jobService.getJobsAsync()
      .then(({ data }) => {
        runInAction(() => { this.jobs = data; });
      })
      .catch((error: unknown) => {
        runInAction(() => {
          this.jobsError = this.getApiErrorMessage(error, 'Dohvat poslova nije uspio. Pokušajte ponovno.');
        });
      })
      .finally(() => {
        runInAction(() => {
          this.isLoadingJobs = false;
          this.jobsRequest = null;
        });
      });
    return this.jobsRequest;
  };

  loadContractors = (): Promise<void> => {
    if (this.contractorsRequest) return this.contractorsRequest;
    this.isLoadingContractors = true;
    this.contractorsError = null;
    this.contractorsRequest = this.userService.getContractorsAsync()
      .then(({ data }) => {
        runInAction(() => { this.contractors = data; });
      })
      .catch((error: unknown) => {
        runInAction(() => {
          this.contractorsError = this.getApiErrorMessage(error, 'Dohvat izvođača nije uspio. Pokušajte ponovno.');
        });
      })
      .finally(() => {
        runInAction(() => {
          this.isLoadingContractors = false;
          this.contractorsRequest = null;
        });
      });
    return this.contractorsRequest;
  };

  loadOwnProfile = (userId?: string): Promise<void> => {
    if (userId && this.requestedProfileId === userId && this.profileRequest) return this.profileRequest;
    const requestSequence = ++this.profileRequestSequence;
    this.requestedProfileId = userId;
    this.ownProfile = null;
    this.profileError = null;
    this.isLoadingProfile = Boolean(userId);
    if (!userId) {
      this.profileRequest = null;
      return Promise.resolve();
    }
    this.profileRequest = this.userService.getUserAsync(userId)
      .then(({ data }) => {
        runInAction(() => {
          if (requestSequence === this.profileRequestSequence && this.rootStore.authenticationStore.user?.id === userId) {
            this.ownProfile = data;
          }
        });
      })
      .catch((error: unknown) => {
        runInAction(() => {
          if (requestSequence === this.profileRequestSequence && this.rootStore.authenticationStore.user?.id === userId) {
            this.profileError = this.getApiErrorMessage(error, 'Dohvat profila nije uspio. Pokušajte ponovno.');
          }
        });
      })
      .finally(() => {
        runInAction(() => {
          if (requestSequence === this.profileRequestSequence) {
            this.isLoadingProfile = false;
            this.profileRequest = null;
          }
        });
      });
    return this.profileRequest;
  };

  get latestOpenJobs() {
    return this.jobs
      .filter((job) => job.status === 'OPEN')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }

  get openJobCount() {
    return this.jobs.filter((job) => job.status === 'OPEN').length;
  }

  get contractorCountsByCategory() {
    const counts: Record<string, number> = {};
    this.contractors.forEach((contractor) => {
      new Set(contractor.serviceCategories ?? []).forEach((category) => {
        counts[category] = (counts[category] ?? 0) + 1;
      });
    });
    return counts;
  }

  get featuredContractors() {
    return [...this.contractors]
      .sort((a, b) => a.displayName.localeCompare(b.displayName, 'hr'))
      .slice(0, 3);
  }

  private getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || fallbackMessage;
  };
}
