import AuthenticationStore from '@/modules/authentication/stores/AuthenticationStore';
import RegistrationStore from '@/modules/authentication/stores/RegistrationStore';
import HomeStore from '@/modules/home/stores/HomeStore';
import BidStore from '@/modules/marketplace/bids/stores/BidStore';
import JobStore from '@/modules/marketplace/jobs/stores/JobStore';
import ReviewStore from '@/modules/marketplace/reviews/stores/ReviewStore';
import NavigationStore from '@/modules/navigation/stores/NavigationStore';
import UserStore from '@/modules/user/stores/UserStore';

export default class RootStore {
  constructor() {
    this.authenticationStore = new AuthenticationStore(this);
    this.jobStore = new JobStore(this);
    this.bidStore = new BidStore(this);
    this.reviewStore = new ReviewStore(this);
    this.registrationStore = new RegistrationStore(this);
    this.navigationStore = new NavigationStore(this);
    this.userStore = new UserStore(this);
    this.homeStore = new HomeStore(this);
  }
  
  authenticationStore: AuthenticationStore;
  jobStore: JobStore;
  bidStore: BidStore;
  reviewStore: ReviewStore;
  registrationStore: RegistrationStore;
  navigationStore: NavigationStore;
  userStore: UserStore;
  homeStore: HomeStore;
}
