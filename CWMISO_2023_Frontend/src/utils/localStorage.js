const useLocalStorage = {
  
  async localStorage() {
    localStorage.getItem("token_second") != null
    ? localStorage.removeItem('token_second')
    : '';
  },
}

export default useLocalStorage
