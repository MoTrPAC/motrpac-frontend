import { types } from './uploadActions';

export const defaultUploadState = {
  stagedFiles: [],
  uploadFiles: [],
  submitted: false,
  validated: false,
  formValues: {
    dataType: 'WGS',
    collectionDate: '',
    biospecimenID: '',
    subjectType: 'Human',
    studyPhase: '1',
    rawData: false,
    processedData: false,
    description: '',
  },
  dragging: 0,
  previousUploads: [],
  experimentIndex: -1, // Index of experiment currently being modified with uploads
  validity: false,
};

// Creates filter to not allow already existing files based on file name
//  Input: Names of files already in area of interest.
//  Output: Filter to remove files in that original list
function createFileFilter(originalFileNames) {
  // Filter to ensure files don't share the same name
  function uniqueFileNameFilter(file) {
    // equals 1 if  file already in original filenames --> criteria to remove
    const isIn = originalFileNames.filter(name => name === file.name).length;
    return !(isIn === 1);
  }
  return uniqueFileNameFilter;
}

// Mock function for creating UUIDs, Ideally they would be returned from a backend
// TODO: Make this function irrelvant through backend integration
function generateUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// Reducer to handle actions sent from componenets related to uploading data
export function UploadReducer(state = { ...defaultUploadState }, action) {
  // TODO: Filter by name && path? Add suffix for duplicates?

  // Filter to ensure files sent to staging don't share the same name
  const fileNames = state.stagedFiles.map(stagedFile => stagedFile.name);
  const uniqueFileNameCheck = createFileFilter(fileNames);

  // Filter to ensure files sent from staging to upload don't share the same name
  const uploadNames = state.uploadFiles.map(uploadingFile => uploadingFile.file.name);
  const uniqueUploadCheck = createFileFilter(uploadNames);

  // Handles state to return based on action
  switch (action.type) {
    // Dragging state modified when file dragged over or exits
    case types.DRAG_ENTER:
      return { ...state, dragging: state.dragging + 1 };
    case types.DRAG_LEAVE:
      return { ...state, dragging: state.dragging - 1 };

    // Fires on file drop in to area or when files selected
    case types.FILES_ADDED:
    // Returns state with unique file names
      return {
        ...state,
        stagedFiles: [...[...action.files].filter(uniqueFileNameCheck), ...state.stagedFiles],
        dragging: 0,
      };

    // Removes staged file if X button clicked
    case types.REMOVE_FILE:
      return {
        ...state,
        stagedFiles: state.stagedFiles.filter(file => file.name !== action.name),
      };

    case types.FORM_CHANGE: {
      const NewFormValues = {
        ...state.formValues,
      };

      if (action.eID === 'processedData' || action.eID === 'rawData') {
        NewFormValues[action.eID] = action.checked;
      } else {
        NewFormValues[action.eID] = action.changeValue;
      }

      return {
        ...state,
        formValues: NewFormValues,
      };
    }
    // On form submit sends staged files to upload status area.
    case types.FORM_SUBMIT: {
      // if form invalid or no files staged, returns previous state
      if (!action.validity || state.stagedFiles.length === 0) {
        return {
          ...state,
          validated: true,
        };
      }

      // Initiates files sent to upload area with status "uploading"
      // NOTE: Filtering done by ID, but in current implementation ID is set to FILENAME
      const uploadingFiles = [...state.stagedFiles].map(file => ({ file, status: 'UPLOADING', id: file.name }));

      // Creates dictionary from form fields
      const formData = {
        dataType: action.elements.dataType.value,
        biospecimenID: action.elements.biospecimenID.value,
        collectionDate: action.elements.collectionDate.value,
        subjectType: action.elements.subjectType.value,
        studyPhase: action.elements.studyPhase.value,
        rawData: action.elements.rawData.checked,
        processedData: action.elements.processedData.checked,
      };

      let expIndex = state.previousUploads
        .findIndex(exp => ((exp.biospecimenID === formData.biospecimenID) && (exp.dataType === formData.dataType)));

      const now = Date.now();

      let prevUploads = [...state.previousUploads];

      if (expIndex === -1) {
        expIndex = 0;
        const uploadDate = now;
        const experiment = {
          biospecimenID: formData.biospecimenID,
          dataType: formData.dataType,
          subject: formData.subjectType,
          phase: formData.studyPhase,
          date: formData.collectionDate,
          lastUpdated: uploadDate,
          availability: 'Pending Q.C.',
          history: [],
        };
        prevUploads = [experiment, ...state.previousUploads];
      }

      return {
        ...state,
        formValues: formData,
        validated: true,
        submitted: true,
        uploadFiles: [...uploadingFiles.filter(uniqueUploadCheck), ...state.uploadFiles],
        stagedFiles: [],
        previousUploads: prevUploads,
        experimentIndex: expIndex,
      };
    }
    case types.CANCEL_UPLOAD: {
      const remainingFiles = state.uploadFiles.filter(upload => !(upload.id === action.id));
      return {
        ...state,
        uploadFiles: remainingFiles,
      };
    }

    case types.UPLOAD_SUCCESS: {
      // Update status of succesful file
      const newUploadsState = state.uploadFiles.map((uploadItem) => {
        if (uploadItem.id === action.upload.id) {
          return {
            ...uploadItem,
            status: 'UPLOAD_SUCCESS',
          };
        }
        return uploadItem;
      });

      // Update upload history with filename
      const experiment = {
        ...state.previousUploads[state.experimentIndex],
        history: [
          {
            fileName: action.upload.file.name,
            timeStamp: Date.now(),
            uuid: generateUUID(),
          },
          ...state.previousUploads[state.experimentIndex].history,
        ],
      };
      const prevUploads = [
        ...state.previousUploads,
      ];

      prevUploads[state.experimentIndex] = experiment;


      return {
        ...state,
        previousUploads: prevUploads,
        uploadFiles: newUploadsState,
      };
    }

    case types.CLEAR_FORM:
      return {
        ...defaultUploadState,
        previousUploads: [...state.previousUploads],
      };
    
    case types.EXPAND_UPLOAD_HISTORY: {
      const prevUploads = state.previousUploads.map((upload) => {
        if (action.upload === upload) {
          return {
            ...upload,
            expanded: !(upload.expanded),
          };
        }
        return upload;
      });
      return {
        ...state,
        previousUploads: prevUploads,
      };
    }

    case types.SET_ALL_SUCCESS: {
      // Update status of succesful file
      const newUploadsState = state.uploadFiles.map((uploadItem) => {
        if (uploadItem.status === 'UPLOADING') {
          return {
            ...uploadItem,
            status: 'UPLOAD_SUCCESS',
          };
        }
        return uploadItem;
      });

      // Update upload history with filename
      const successUploads = newUploadsState.filter(upload => (upload.status === 'UPLOAD_SUCCESS'));
      const historyAddition = successUploads.map((upload) => {
        return {
          fileName: upload.file.name,
          timeStamp: Date.now(),
          uuid: generateUUID(),
        };
      });
      const experiment = {
        ...state.previousUploads[state.experimentIndex],
        history: [
          ...historyAddition,
          ...state.previousUploads[state.experimentIndex].history,
        ],
      };
      const prevUploads = [
        ...state.previousUploads,
      ];

      prevUploads[state.experimentIndex] = experiment;
      return {
        ...state,
        previousUploads: prevUploads,
        uploadFiles: newUploadsState,
      };
    }

    default:
      return state;
  }
}

export default UploadReducer;
