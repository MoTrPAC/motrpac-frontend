export const defaultUploadState = {
  files: [],
  uploadFiles: [],
  formValues: {},
  dragging: 0,
};

export function UploadReducer(state = { ...defaultUploadState }, action) {
  // TODO: Filter by name && path? Add suffix for duplicates?
  const fileNames = state.files.map(stagedFile => stagedFile.name);
  // Filter to ensure files sent to staging don't share the same name
  function uniqueFileNameCheck(file) {
    // TODO: Look in to 'const isIn = fileNames.filter(name => name === file.name);'
    const isIn = fileNames.indexOf(file.name);
    if (isIn === -1) {
      return true;
    }
    return false;
  }

  const uploadNames = state.uploadFiles.map(uploadingFile => uploadingFile.file.name);
  // Filter to ensure files sent from staging to upload don't share the same name
  function uniqueUploadCheck(upload) {
    const isIn = uploadNames.indexOf(upload.file.name);
    if (isIn === -1) {
      return true;
    }
    return false;
  }

  // Handles state to return based on action
  switch (action.type) {
    // Dragging state modified when file dragged over or exits
    case 'DRAG_ENTER':
      return { ...state, dragging: state.dragging + 1 };
    case 'DRAG_LEAVE':
      return { ...state, dragging: state.dragging - 1 };

    // Fires on file drop in to area or when files selected
    case 'FILES_ADDED':
    // Returns state with unique file names
      return {
        ...state,
        files: [...[...action.files].filter(uniqueFileNameCheck), ...state.files],
        dragging: 0,
      };

    // Removes staged file if X button clicked
    case 'REMOVE_FILE':
      return {
        ...state,
        files: state.files.filter(file => file.name !== action.name),
      };
    // On form submit sends staged files to upload status area.
    case 'FORM_SUBMIT': {
      // if form invalid or no files staged, returns previous state
      if (!action.validity || state.files.length === 0) {
        return {
          ...state,
          validated: true,
        };
      }

      // Initiates files sent to upload area with status "uploading"
      const uploadingFiles = [...state.files].map(file => ({ file, status: 'UPLOADING' }));

      // Creates dictionary from form fields
      const formData = {
        dataType: action.elements.dataType.value,
        identifier: action.elements.identifier.value,
        collectionDate: action.elements.collectionDate.value,
        subjectType: action.elements.subjectType.value,
        studyPhase: action.elements.studyPhase.value,
      };

      return {
        ...state,
        formValues: formData,
        validated: true,
        submitted: true,
        uploadFiles: [...uploadingFiles.filter(uniqueUploadCheck), ...state.uploadFiles],
        files: [],
      };
    }

    default:
      return state;
  }
}

export default UploadReducer;
