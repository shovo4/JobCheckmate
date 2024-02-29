function logout() {

    localStorage.clear();
    window.location.reload();
    window.location.href = '/';
  }
  export default logout;