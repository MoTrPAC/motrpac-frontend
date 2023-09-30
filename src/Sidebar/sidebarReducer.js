export const defaultSidebarState = {
  expanded: true,
};

export default function SidebarReducer(
  state = { ...defaultSidebarState },
  action
) {
  switch (action.type) {
    case 'SIDEBAR_TOGGLED':
      return {
        ...state,
        expanded: !state.expanded,
      };
    default:
      return state;
  }
}
