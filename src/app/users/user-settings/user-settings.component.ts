import { APP_CONFIG, AppConfig } from "../../app-config.module";
import { Component, OnInit, Inject } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { UserApi } from "shared/sdk/services";
import * as ua from "state-management/actions/user.actions";
import * as selectors from "state-management/selectors";
import { Message, MessageType } from "state-management/models";
import { LoginService } from "users/login.service";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.css"]
})
export class UserSettingsComponent implements OnInit {
  user: object;
  settings$ = null;
  profileImage = "assets/images/user.png";
  profile: object;
  email: string;
  displayName: string;

  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private us: UserApi,
    private store: Store<any>,
    private loginService: LoginService
  ) {
    this.store.select(selectors.users.getCurrentUser).subscribe(user => {
      this.user = user;
    });
    console.log(this.us.getCurrentToken());
    this.settings$ = this.store.pipe(select(selectors.users.getSettings));

    // TODO handle service and endpoint for user settings
  }

  ngOnInit() {
    this.store
      .pipe(select(state => state.root.user.currentUser))
      .subscribe(current => {
        this.loginService.getUserIdent$(current.id).subscribe(userId => {
          this.email = userId.profile.email;
          this.displayName = userId.profile.displayName;
          if (!this.appConfig.userProfileImageEnabled || userId.profile === null) {
            this.profileImage = "assets/images/user.png";
          } else {
            this.profileImage = userId.profile.thumbnailPhoto;
          }
          console.log(userId.profile);
          console.log(this.profileImage);
        });
      });
  }

  onSubmit(values) {
    // TODO validate here
    console.log(values);
    // values['darkTheme'] = (values['darkTheme'].toLowerCase() === 'true')
    this.store.dispatch(new ua.SaveSettingsAction(values));
    const msg = new Message();
    msg.content = "Settings saved locally";
    msg.type = MessageType.Success;
    this.store.dispatch(new ua.ShowMessageAction(msg));
  }
}
