import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { hot, cold } from "jasmine-marbles";
import { Observable } from "rxjs";
import { LogbookEffects } from "./logbooks.effects";
import { LogbookApi, Logbook } from "shared/sdk";
import * as fromActions from "state-management/actions/logbooks.actions";
import { LogbookFilters } from "state-management/models";

const logbook = new Logbook();

describe("LogbookEffects", () => {
  let actions: Observable<any>;
  let effects: LogbookEffects;
  let logbookApi: jasmine.SpyObj<LogbookApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogbookEffects,
        provideMockActions(() => actions),
        {
          provide: LogbookApi,
          useValue: jasmine.createSpyObj("logbookApi", [
            "findAll",
            "findByName",
            "filter"
          ])
        }
      ]
    });

    effects = TestBed.get(LogbookEffects);
    logbookApi = TestBed.get(LogbookApi);
  });

  describe("fetchLogbooks$", () => {
    it("should result in a fetchLogbooksCompleteAction", () => {
      const logbooks = [logbook];
      const action = fromActions.fetchLogbooksAction();
      const outcome = fromActions.fetchLogbooksCompleteAction({ logbooks });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: logbooks });
      logbookApi.findAll.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchLogbooks$).toBeObservable(expected);
    });

    it("should result in a fetchLogbooksFailedAction", () => {
      const action = fromActions.fetchLogbooksAction();
      const outcome = fromActions.fetchLogbooksFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      logbookApi.findAll.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchLogbooks$).toBeObservable(expected);
    });
  });

  describe("fetchLogbook$", () => {
    const name = "test";

    it("should result in a fetchLogbookCompleteAction", () => {
      const action = fromActions.fetchLogbookAction({ name });
      const outcome = fromActions.fetchLogbookCompleteAction({ logbook });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: logbook });
      logbookApi.findByName.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchLogbook$).toBeObservable(expected);
    });

    it("should result in a fetchLogbookFailedAction", () => {
      const action = fromActions.fetchLogbookAction({ name });
      const outcome = fromActions.fetchLogbookFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      logbookApi.findByName.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchLogbook$).toBeObservable(expected);
    });
  });

  describe("fetchFilteredEntries$", () => {
    const name = "testName";
    const filters: LogbookFilters = {
      textSearch: "test",
      showBotMessages: true,
      showImages: true,
      showUserMessages: true
    };

    it("should result in a fetchFilteredEntriesCompleteAction", () => {
      const action = fromActions.fetchFilteredEntriesAction({ name, filters });
      const outcome = fromActions.fetchFilteredEntriesCompleteAction({
        logbook
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: logbook });
      logbookApi.filter.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchFilteredEntries$).toBeObservable(expected);
    });

    it("should result in a fetchFilteredEntriesFailedAction", () => {
      const action = fromActions.fetchFilteredEntriesAction({ name, filters });
      const outcome = fromActions.fetchFilteredEntriesFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      logbookApi.filter.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchFilteredEntries$).toBeObservable(expected);
    });
  });
});