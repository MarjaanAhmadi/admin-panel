//action for showing loading
export const showLoading = loading => ({
  type: "SHOW_LOADING",
  loading
});

//actions for changing language
export const changeLanguage = selectedLanguage => ({
  type: "CHANGE_LANGUAGE",
  selectedLanguage
});

//action to set showing side bar nav or not
export const setShowNav = showNav => ({
  type: "SET_SHOWNAV",
  showNav
});

//action to set token
export const setToken = token => ({
  type: "SET_TOKEN",
  token
});

//action to set user details after login
export const setUser = user => ({
  type: "SET_USER",
  user
});

//action to set invoices list when project is rendering
export const setInvoices = invoices => ({
  type: "SET_INVOICES",
  invoices
});

//action to save invoice length list from server
export const setInvoiceCounter = invoiceCounter => ({
  type: "SET_INVOICE_COUNT",
  invoiceCounter
});
