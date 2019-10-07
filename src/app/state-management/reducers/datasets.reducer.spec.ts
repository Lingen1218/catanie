import * as fromDatasets from "./datasets.reducer";
import * as fromActions from "../actions/datasets.actions";
import {
  Dataset,
  DatasetInterface,
  Attachment,
  RawDataset
} from "shared/sdk/models";
import {
  FacetCounts,
  DatasetState
} from "state-management/state/datasets.store";
import { ArchViewMode, ScientificCondition } from "../models";

const data: DatasetInterface = {
  owner: "",
  contactEmail: "",
  sourceFolder: "",
  creationTime: new Date(),
  type: "",
  ownerGroup: "",
  attachments: []
};
const dataset = new Dataset({ pid: "testPid", ...data });

const initialDatasetState: DatasetState = {
  datasets: [],
  selectedSets: [],
  currentSet: dataset,
  facetCounts: {},
  totalCount: 0,

  isLoading: true,
  hasPrefilledFilters: false,

  searchTerms: "run",
  keywordsTerms: "",
  batch: [],

  openwhiskResult: {},

  filters: {
    mode: {},
    modeToggle: ArchViewMode.all,
    text: "",
    creationTime: {
      begin: "2019-10-03",
      end: "2019-10-04"
    },
    type: [],
    creationLocation: [],
    ownerGroup: [],
    skip: 0,
    limit: 25,
    sortField: "creationTime:desc",
    keywords: [],
    scientific: [],
    isPublished: false
  }
};

describe("DatasetsReducer", () => {
  describe("on #fetchDatasetsAction()", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchDatasetsAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on #fetchDatasetsCompleteAction()", () => {
    it("should set datasets property and set isLoading to false", () => {
      const datasets = [dataset];
      const action = fromActions.fetchDatasetsCompleteAction({ datasets });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.datasets).toEqual(datasets);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #fetchDatasetsFailedAction()", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchDatasetsFailedAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #fetchFacetCountsAction()", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchFacetCountsAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on #fetchFacetCountsCompleteAction()", () => {
    it("should set facetCounts and totalCount properties and set isLoading to false", () => {
      const facetCounts: FacetCounts = {};
      const allCounts = 0;
      const action = fromActions.fetchFacetCountsCompleteAction({
        facetCounts,
        allCounts
      });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.facetCounts).toEqual(facetCounts);
      expect(state.totalCount).toEqual(allCounts);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #fetchFacetCountsFailedAction()", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchFacetCountsFailedAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #fetchDatasetAction()", () => {
    it("should set isLoading to true", () => {
      const pid = "testPid";
      const action = fromActions.fetchDatasetAction({ pid });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on #fetchDatasetCompleteAction()", () => {
    it("should set currentSet property and set isLoading to false", () => {
      const action = fromActions.fetchDatasetCompleteAction({ dataset });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.currentSet).toEqual(dataset);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #fetchDatasetFailedAction()", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchDatasetFailedAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #prefillBatchCompleteAction()", () => {
    it("should set batch property", () => {
      const batch = [];
      const action = fromActions.prefillBatchCompleteAction({ batch });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.batch).toEqual(batch);
    });
  });

  describe("on #addToBatchAction()", () => {
    it("should update batch property with selectedSets", () => {
      const batchedPids = initialDatasetState.batch.map(
        batchSet => batchSet.pid
      );
      const addition = initialDatasetState.selectedSets.filter(
        selectedSet => batchedPids.indexOf(selectedSet.pid) === -1
      );
      const batch = [...initialDatasetState.batch, ...addition];

      const action = fromActions.addToBatchAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.batch).toEqual(batch);
    });
  });

  describe("on #removeFromBatchAction()", () => {
    it("should remove dataset from batch", () => {
      const action = fromActions.removeFromBatchAction({ dataset });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.batch).not.toEqual([dataset]);
    });
  });

  describe("on #clearBatchAction()", () => {
    it("should clear batch", () => {
      const initialBatch = initialDatasetState.batch;
      expect(initialBatch).toEqual([]);

      initialDatasetState.batch.push(dataset);

      expect(initialDatasetState.batch).toContain(dataset);

      const action = fromActions.clearBatchAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.batch).not.toEqual([dataset]);
    });
  });

  describe("on #saveDatasetAction()", () => {
    it("should set isLoading to true", () => {
      const rawDataset = new RawDataset();
      const metadata = {};
      const action = fromActions.saveDatasetAction({
        dataset: rawDataset,
        metadata
      });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on #saveDatasetCompleteAction()", () => {
    it("should set currentSet property and set isLoading to false", () => {
      const action = fromActions.saveDatasetCompleteAction({ dataset });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.currentSet).toEqual(dataset);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #saveDatasetFailedAction()", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.saveDatasetFailedAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #addAttachmentAction()", () => {
    it("should set isLoading to true", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentAction({ attachment });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on #addAttachmentCompleteAction()", () => {
    it("should add attachment to currentSet property and set isLoading to false", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentCompleteAction({ attachment });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.currentSet.attachments).toContain(attachment);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #addAttachmentFailedAction()", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.addAttachmentFailedAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #updateAttachmentCaptionAction()", () => {
    it("should set isLoading to true", () => {
      const datasetId = "testPid";
      const attachmentId = "testId";
      const caption = "test";
      const action = fromActions.updateAttachmentCaptionAction({
        datasetId,
        attachmentId,
        caption
      });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on #updateAttachmentCaptionCompleteAction()", () => {
    it("should add new caption to an attachment and set isLoading to false", () => {
      const attachment = new Attachment();
      const action = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.currentSet.attachments).toContain(attachment);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #updateAttachmentCaptionFailedAction()", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.updateAttachmentCaptionFailedAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #removeAttachmentAction()", () => {
    it("should set isLoading to true", () => {
      const datasetId = "testPid";
      const attachmentId = "testId";

      initialDatasetState.currentSet.pid = datasetId;
      const attachment = new Attachment();
      attachment.id = attachmentId;
      initialDatasetState.currentSet.attachments = [attachment];

      const action = fromActions.removeAttachmentAction({
        datasetId,
        attachmentId
      });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on #removeAttachmentCompleteAction()", () => {
    it("should add attachment to currentSet property and set isLoading to false", () => {
      initialDatasetState.currentSet.pid = "testPid";
      const attachment = new Attachment();
      const attachmentId = "testId";
      attachment.id = attachmentId;
      initialDatasetState.currentSet.attachments = [attachment];

      const action = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.currentSet.attachments).toEqual([]);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #removeAttachmentFailedAction()", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.removeAttachmentFailedAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on #selectDatasetAction()", () => {
    it("should check if data is selected in selectedSets", () => {
      const action = fromActions.selectDatasetAction({ dataset });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.selectedSets).toEqual([dataset]);
    });
  });

  describe("on #deselectDatasetAction()", () => {
    it("should check that data is not in selectedSets", () => {
      const action = fromActions.deselectDatasetAction({ dataset });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.selectedSets).not.toEqual([dataset]);
    });
  });

  describe("on #selectAllDatasetsAction", () => {
    it("should set selectedSets", () => {
      initialDatasetState.datasets = [dataset];

      const action = fromActions.selectAllDatasetsAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.selectedSets).toEqual([dataset]);
    });
  });

  describe("on #clearSelectionAction()", () => {
    it("should set selectedSets to an empty array", () => {
      const action = fromActions.clearSelectionAction();
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.selectedSets).toEqual([]);
    });
  });

  describe("on #changePageAction()", () => {
    it("should set filters limit and skip", () => {
      const page = 1;
      const limit = 1;
      const skip = page * limit;

      const action = fromActions.changePageAction({ page, limit });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.limit).toEqual(limit);
      expect(state.filters.skip).toEqual(skip);
    });
  });

  describe("on #sortByColumnAction()", () => {
    it("should set sortField and set skip to 0", () => {
      const column = "test";
      const direction = "asc";
      const sortField = column + (direction ? ":" + direction : "");

      const action = fromActions.sortByColumnAction({ column, direction });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.sortField).toEqual(sortField);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #setSearchTermsAction()", () => {
    it("should set searchTerms", () => {
      const terms = "abc";

      const action = fromActions.setSearchTermsAction({ terms });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.searchTerms).toEqual(terms);
    });
  });

  describe("on #setArchiveViewModeAction", () => {
    it("should set mode to an empty object, set modetoggle, set skip to 0 and isLoading to true", () => {
      const modeToggle = ArchViewMode.all;

      const action = fromActions.setArchiveViewModeAction({ modeToggle });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.mode).toEqual({});
      expect(state.filters.modeToggle).toEqual(modeToggle);
      expect(state.filters.skip).toEqual(0);
      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on #setPublicViewMode()", () => {
    it("should set isPublished", () => {
      const isPublished = true;

      const action = fromActions.setPublicViewModeAction({ isPublished });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.isPublished).toEqual(isPublished);
    });
  });

  describe("on #prefillFiltersAction()", () => {
    it("should set searchTerms and set hasPrefilledFilters to true", () => {
      const values = {
        text: "test"
      };
      const action = fromActions.prefillFiltersAction({ values });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.text).toEqual(values.text);
      expect(state.searchTerms).toEqual(values.text);
      expect(state.hasPrefilledFilters).toEqual(true);
    });
  });

  describe("on #clearFacetsAction()", () => {
    it("should clear filters while saving the filters limit and set searchTerms to an empty string", () => {
      const limit = 10;
      const page = 1;
      const skip = limit * page;

      const act = fromActions.changePageAction({ page, limit });
      const sta = fromDatasets.datasetsReducer(initialDatasetState, act);

      expect(sta.filters.skip).toEqual(skip);

      const action = fromActions.clearFacetsAction();
      const state = fromDatasets.datasetsReducer(sta, action);

      expect(state.filters.skip).toEqual(0);
      expect(state.filters.limit).toEqual(limit);
      expect(state.searchTerms).toEqual("");
    });
  });

  describe("on #setTextFilterAction()", () => {
    it("should set text filter and set skip to 0", () => {
      const text = "test";

      const action = fromActions.setTextFilterAction({ text });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.text).toEqual(text);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #addLocationFilterAction()", () => {
    it("should set location filter and set skip to 0", () => {
      const location = "test";

      const action = fromActions.addLocationFilterAction({ location });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.creationLocation).toContain(location);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #removeLocationFilterAction()", () => {
    it("should remove location filter and set skip to 0", () => {
      const location = "test";

      const action = fromActions.removeLocationFilterAction({ location });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.creationLocation).not.toContain(location);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #addGroupFilterAction()", () => {
    it("should set  ownergroup filter and set skip to 0", () => {
      const group = "test";

      const action = fromActions.addGroupFilterAction({ group });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.ownerGroup).toContain(group);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #removeGroupFilterAction()", () => {
    it("should remove ownergroup filter and set skip to 0", () => {
      const group = "test";

      const action = fromActions.removeGroupFilterAction({ group });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.ownerGroup).not.toContain(group);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #addTypeFilterAction()", () => {
    it("should set type filter and set skip to 0", () => {
      const datasetType = "test";

      const action = fromActions.addTypeFilterAction({ datasetType });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.type).toContain(datasetType);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #removeTypeFilterAction()", () => {
    it("should remove type filter and set skip to 0", () => {
      const datasetType = "test";

      const action = fromActions.removeTypeFilterAction({ datasetType });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.type).not.toContain(datasetType);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #addKeywordFilterAction()", () => {
    it("should set keyword filter and set skip to 0", () => {
      const keyword = "test";

      const action = fromActions.addKeywordFilterAction({ keyword });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.keywords).toContain(keyword);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #removeKeywordFilterAction()", () => {
    it("should remove keyword filter and set skip to 0", () => {
      const keyword = "test";

      const action = fromActions.removeKeywordFilterAction({ keyword });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.keywords).not.toContain(keyword);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on #setDateRangeFilterAction()", () => {
    it("should set creationTime filter", () => {
      const begin = new Date(2018, 1, 2).toISOString();
      const end = new Date(2018, 1, 3).toISOString();

      const action = fromActions.setDateRangeFilterAction({ begin, end });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.creationTime).toEqual({ begin, end });
    });
  });

  describe("on #addScientificConditionAction()", () => {
    it("should add scientific condition to scientific filter", () => {
      const condition: ScientificCondition = {
        lhs: "lhsTest",
        relation: "EQUAL_TO_STRING",
        rhs: "rhsTest"
      };

      const action = fromActions.addScientificConditionAction({ condition });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.scientific).toContain(condition);
    });
  });

  describe("on #removeScientificConditionAction()", () => {
    it("should remove scientific condition from scientific filter", () => {
      const condition: ScientificCondition = {
        lhs: "lhsTest",
        relation: "EQUAL_TO_STRING",
        rhs: "rhsTest"
      };
      const act = fromActions.addScientificConditionAction({ condition });
      const sta = fromDatasets.datasetsReducer(initialDatasetState, act);

      expect(sta.filters.scientific).toContain(condition);

      const index = 0;

      const action = fromActions.removeScientificConditionAction({ index });
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);

      expect(state.filters.scientific).not.toContain(condition);
    });
  });
});
