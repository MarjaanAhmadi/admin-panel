const initialState = {
  loading: false,
  language: "per",
  showNav: "true",
  token: localStorage.getItem("highway-token"),
  user: '',
  invoices: [],
  invoiceCount: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_LOADING": {
      return {
        ...state,
        loading: action.loading
      };
    }
    case "CHANGE_LANGUAGE": {
      return {
        ...state,
        language: action.selectedLanguage
      };
    }
    case "SET_SHOWNAV": {
      return {
        ...state,
        showNav: !state.showNav
      };
    }
    case "SET_TOKEN": {
      return {
        ...state,
        token: action.token
      };
    }
    case "SET_USER": {
      return {
        ...state,
        user: action.user
      };
    }
    case "SET_INVOICES": {
      return {
        ...state,
        invoices: action.invoices
      };
    }
    case "SET_INVOICE_COUNT": {
      return {
        ...state,
        invoiceCount: action.invoiceCount
      };
    }
    default:
      return state;
  }
};
export default reducer;
