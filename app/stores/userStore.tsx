import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";

interface UserInfo {
  displayName?: string;
  photoURL?: string;
  email?: string;

}

class UserStore {
  userInfo: UserInfo | null = null;
  loading: boolean = true;
  showSearch: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUserInfo(userInfo: UserInfo | null) {
    this.userInfo = userInfo;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }
  setShowSearch() {
    this.showSearch = !this.showSearch;
  }

  async checkLocalUser() {
    try {
      this.setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData: UserInfo | null = userJSON ? JSON.parse(userJSON) : null;
      console.log("local storage: ", userData);
      this.setUserInfo(userData);
    } catch (e) {
      console.error("Error reading local user data: ", e);
      alert("Failed to load user data. Please try again.");
    } finally {
      this.setLoading(false);
    }
  }

  get userName() {
    return this.userInfo?.displayName || "User";
  }

  get userPhoto() {
    return this.userInfo?.photoURL || "https://via.placeholder.com/150";
  }

  get userEmail() {
    return this.userInfo?.email || "sample.mail@xyz.com";
  }
}

const userStore = new UserStore();
export default userStore;
