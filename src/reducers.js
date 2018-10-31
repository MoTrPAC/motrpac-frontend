function UploadReducer(state = {}, action) {
  const fileNames = state.files.map(OldFile => OldFile.name);
  // Filter to ensure files sent to staging don't share the same name
  function UniqueFileCheck(file) {
    const isIn = fileNames.indexOf(file.name);
    if (isIn === -1) {
      return true;
    }
    return false;
  }
  const uploadNames = state.uploadFiles.map(OldFile => OldFile.file.name);

  // Filter to ensure files sent from staging to upload don't share the same name
  function UniqueUploadCheck(upload) {
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
    // Returns state with unique files
      return {
        ...state,
        files: [...[...action.files].filter(UniqueFileCheck), ...state.files],
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
      if (!action.target.checkValidity() || state.files.length === 0) {
        return {
          ...state,
          validated: true,
        };
      }

      // Initiates files sent to upload area with status "uploading"
      const uploadingFiles = [...state.files].map(file => ({ file, status: 'UPLOADING' }));

      // Creates dictionary from form fields
      const formData = {
        dataType: action.target.elements.dataType.value,
        identifier: action.target.elements.identifier.value,
        collectionDate: action.target.elements.collectionDate.value,
        subjectType: action.target.elements.subjectType.value,
        studyPhase: action.target.elements.studyPhase.value,
      };

      return {
        ...state,
        formValues: formData,
        validated: true,
        uploadFiles: [...uploadingFiles.filter(UniqueUploadCheck), ...state.uploadFiles],
        files: [],
      };
    }

    default:
      return state;
  }
}

export default UploadReducer;
